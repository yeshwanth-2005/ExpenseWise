const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// To signup or To create new account
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,{expiresIn: "3d"});
        res.cookie('token', token, { httpOnly: true, maxAge:3 * 60 * 60 * 1000 });
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// To login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials: User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials: Incorrect password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,{expiresIn: "3d"});
        res.cookie('token', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// To logout
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
};

// To check authentication
exports.checkAuth = (req, res) => {
    res.json({ success: true });
};
