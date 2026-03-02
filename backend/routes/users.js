const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validateUser, validateLogin } = require('../middleware/validator');

router.post('/register', validateUser, async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            const error = new Error('Email already registered');
            error.statusCode = 400;
            return next(error);
        }
        const user = await User.create({ name, email, password });
        res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        next(err);
    }
});

router.post('/login', validateLogin, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);
        }
        res.json({ success: true, data: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
