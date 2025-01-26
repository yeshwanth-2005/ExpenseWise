const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['salary', 'freelance', 'investments', 'rental', 'other']
    },
    date: {
        type: Date,
        required: true
    },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);