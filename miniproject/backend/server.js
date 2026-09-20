const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key';

app.use(express.json());
app.use(cors());

//  Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/expense-monitor', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//  User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Expense Schema (Date stored as string)
const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true }, //  Store date as string
    notes: { type: String }
});
const Expense = mongoose.model('Expense', ExpenseSchema);

//  Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

//  Signup Route
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

//  Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});

//  Fetch Expenses (Sorted by date)
app.get('/api/expenses', verifyToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

//  Add Expense (Date stored as string)
app.post('/api/expenses', verifyToken, async (req, res) => {
    const { title, amount, category, date, notes } = req.body;
    
    //  Validate all fields
    if (!title || !amount || !category || !date || !notes) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const expense = new Expense({
            userId: req.user.userId,
            title,
            amount,
            category,
            date, //  Store date as string
            notes
        });

        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

//  Update Expense (Date as string)
app.put('/api/expenses/:id', verifyToken, async (req, res) => {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category || !date || !notes) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { title, amount, category, date, notes },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update expense' });
    }
});

// Delete Expense
app.delete('/api/expenses/:id', verifyToken, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!expense) return res.status(404).json({ error: 'Expense not found' });

        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

//  Start the Server
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
