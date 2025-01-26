const User = require('../models/User');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// To get user information
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id). select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// To update user info
exports.updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// To change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }     
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// To delete user from Database
exports.deleteUser = async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await Expense.deleteMany({ userId: req.user._id }, { session });
            await Income.deleteMany({ userId: req.user._id }, { session });
            await User.findByIdAndDelete(req.user._id, { session });
            await session.commitTransaction();
            res.json({ success: true });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};