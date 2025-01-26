const mongoose = require('mongoose');
const Income = require('../models/Income');

// To create a new income
exports.newIncome = async (req, res) => {
    try {
        const income = new Income({
            ...req.body,
            userId: req.user._id
        });
        await income.save();
        res.json({ success: true, income });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// To get all incomes in descending order
exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(incomes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// To update income
exports.updateIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!income) {
            return res.status(404).json({ error: 'Income not found' });
        }
        res.json(income);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// To delete income
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!income) {
            return res.status(404).json({ error: 'Income not found' });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
