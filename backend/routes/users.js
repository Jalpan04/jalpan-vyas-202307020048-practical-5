/**
 * Users API Routes
 * Handles user registration and authentication
 */

const express = require('express');
const router = express.Router();
const { validateUser, validateLogin } = require('../middleware/validator');

// In-Memory User Database
let users = [
    {
        id: 1,
        name: 'Demo User',
        email: 'demo@volt.com',
        password: 'demo123',
        createdAt: new Date().toISOString()
    }
];

// POST /api/users/register - Register new user
router.post('/register', validateUser, (req, res, next) => {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        const error = new Error('User with this email already exists');
        error.statusCode = 400;
        return next(error);
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
});

// POST /api/users/login - Login user
router.post('/login', validateLogin, (req, res, next) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        return next(error);
    }
    
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            token: 'demo-jwt-token-' + user.id // Simulated token
        }
    });
});

// GET /api/users/profile - Get user profile
router.get('/profile', (req, res) => {
    // In production, this would use authentication middleware
    res.json({
        success: true,
        data: {
            id: 1,
            name: 'Demo User',
            email: 'demo@volt.com'
        }
    });
});

module.exports = router;
