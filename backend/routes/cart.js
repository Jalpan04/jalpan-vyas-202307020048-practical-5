/**
 * Cart API Routes
 * Handles shopping cart operations
 */

const express = require('express');
const router = express.Router();
const { validateCartItem } = require('../middleware/validator');

// In-Memory Cart (userId -> items)
let carts = {
    1: [
        { productId: 1, quantity: 2 },
        { productId: 3, quantity: 1 }
    ]
};

// GET /api/cart - Get user's cart
router.get('/', (req, res) => {
    const userId = 1; // Simulated logged-in user
    const cart = carts[userId] || [];
    
    res.json({
        success: true,
        data: cart
    });
});

// POST /api/cart - Add item to cart
router.post('/', validateCartItem, (req, res) => {
    const userId = 1;
    const { productId, quantity } = req.body;
    
    if (!carts[userId]) {
        carts[userId] = [];
    }
    
    // Check if product already in cart
    const existingItem = carts[userId].find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        carts[userId].push({ productId, quantity });
    }
    
    res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: carts[userId]
    });
});

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:productId', (req, res, next) => {
    const userId = 1;
    const productId = parseInt(req.params.productId);
    
    if (!carts[userId]) {
        const error = new Error('Cart is empty');
        error.statusCode = 404;
        return next(error);
    }
    
    const itemIndex = carts[userId].findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
        const error = new Error('Item not found in cart');
        error.statusCode = 404;
        return next(error);
    }
    
    carts[userId].splice(itemIndex, 1);
    
    res.json({
        success: true,
        message: 'Item removed from cart',
        data: carts[userId]
    });
});

module.exports = router;
