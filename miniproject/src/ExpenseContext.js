import { createContext, useContext, useState,useEffect } from 'react';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState(
        JSON.parse(localStorage.getItem('expenses')) || []
    );

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    return (
        <ExpenseContext.Provider value={{ expenses, setExpenses }}>
            {children}
        </ExpenseContext.Provider>
    );
};
