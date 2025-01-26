const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// To create a new expense
exports.newExpense = async (req, res) => {
    try {
        const expense = new Expense({
            ...req.body,
            userId: req.user._id
        });
        await expense.save();
        res.json({ success: true, expense });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// To get all expenses
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// To update expense
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// To delete expense
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};