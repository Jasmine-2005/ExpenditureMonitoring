import './AppRoute.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Expense() {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [expense, setExpense] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Token from localStorage:", token); // Debugging line
                if (!token) {
                    navigate('/login');
                    return;
                }
        
                const response = await axios.get('http://localhost:5000/api/expenses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
        
                setExpense(response.data);
            } catch (error) {
                console.error(error);
                alert("Failed to fetch expenses");
            }
        };
        

        fetchExpenses();
    }, [navigate]);

    const addExpense = async () => {
        if (!title || !amount || !category || !date || !notes) {
            alert("Please fill all the fields");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const existingIndex = expense.findIndex(item => item.title === title && item.category === category);
            if (existingIndex !== -1) {
                // Update existing entry by adding amounts
                const updateExpense = [...expense];
                updateExpense[existingIndex] = {
                    ...updateExpense[existingIndex],
                    amount: (parseFloat(updateExpense[existingIndex].amount) + parseFloat(amount)).toString()
                };
                setExpense(updateExpense);
            }
            else if (editIndex !== null) {
                // Update existing expense
                const existingExpense = expense[editIndex];
                const updatedExpense = { title, amount, category, date, notes };

                const response = await axios.put(`http://localhost:5000/api/expenses/${existingExpense._id}`, updatedExpense, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const updatedExpenses = [...expense];
                updatedExpenses[editIndex] = response.data;
                setExpense(updatedExpenses);
            } else {
                // Add new expense
                const response = await axios.post('http://localhost:5000/api/expenses', {
                    title, amount, category, date, notes
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setExpense([...expense, response.data]);
            }

            reset();
            setShowForm(false);
        } catch (error) {
            console.error(error);
            alert('Failed to add/update expense');
        }
    };

    const reset = () => {
        setTitle("");
        setAmount("");
        setCategory("");
        setDate("");
        setNotes("");
        setEditIndex(null);
    };

    const editExpense = (index) => {
        const item = expense[index];
        setTitle(item.title);
        setAmount(item.amount);
        setCategory(item.category);
        setDate(item.date);
        setNotes(item.notes);
        setEditIndex(index);
        setShowForm(true);
    };

    const deleteExpense = async (index) => {
        try {
            const id = expense[index]._id;
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpense(expense.filter((_, i) => i !== index));
        } catch (error) {
            console.error(error);
            alert('Failed to delete expense');
        }
    };

    return (
        <div class="expense">
            {showForm ? (
                <div class="edit">
                    <center>
                        <label>Title</label><br />
                        <input
                            id="i1"
                            type="text"
                            class="input"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Title"
                        /><br />

                        <label>Amount</label><br />
                        <input
                            id="i2"
                            type="text"
                            class="input"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            placeholder="Amount"
                        /><br />

                        <label>Category</label><br />
                        <input
                            id="i3"
                            type="text"
                            class="input"
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            placeholder="Category"
                        /><br />

                        <label>Date</label><br />
                        <input
                            id="i4"
                            type="date"
                            class="input"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                        /><br />

                        <label>Notes</label><br />
                        <input
                            id="i5"
                            type="text"
                            class="input"
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="Notes"
                        /><br />

                        <button onClick={addExpense} class="btn">
                            {editIndex === null ? "Add" : "Update"}
                        </button>
                    </center>
                </div>
            ) : (
                <div class="front">
                        <h1><i><u>Expenses</u></i></h1>
                    <center>
                        <table class="table">
                            <tr class="header">
                                <th>No.</th>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th colSpan={2}>Actions</th>
                            </tr>
                            {expense.length === 0 ? (
                                <tr>
                                    <td colSpan="7" class="empty-data">
                                        Your data was empty
                                    </td>
                                </tr>
                            ) : (
                                expense.map((expens, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{expens.title}</td>
                                        <td>{expens.amount}</td>
                                        <td>{expens.category}</td>
                                        <td>{expens.date}</td>
                                        <td class="img">
                                            <p class='edit-img-back'>
                                                <span onClick={() => editExpense(index)} class="edit-img"></span>
                                            </p></td>
                                            <td>
                                            <p class='delete-img-back'>
                                                <span onClick={() => deleteExpense(index)} class="delete-img"></span>
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                    <tr>
                        <td colSpan={6}  align='right' class="align">
                        <p class='add-img-back'><span onClick={()=>setShowForm(true)} class="add-img"></span></p></td>
                        <td>
                        {expense.length > 0 && (
                        <p class='chart-img-back'><span onClick={() => navigate('/chart', { state: { data: expense } })} class="chart-img"></span></p>
                        )
                        }
                        </td>
                    </tr>
                        </table>
                    </center>
                </div>
            )}
        </div>
    );
}

export default Expense;
