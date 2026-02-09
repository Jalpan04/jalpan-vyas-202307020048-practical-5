/**
 * Orders API Routes
 * Handles order placement and history
 */

const express = require('express');
const router = express.Router();
const { validateOrder } = require('../middleware/validator');

// In-Memory Orders Database
let orders = [];
let orderIdCounter = 1;

// POST /api/orders - Place an order
router.post('/', validateOrder, (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = {
        id: orderIdCounter++,
        userId: 1, // Simulated user
        items,
        shippingAddress,
        paymentMethod,
        total,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: newOrder
    });
});

// GET /api/orders - Get order history
router.get('/', (req, res) => {
    const userId = 1; // Simulated user
    const userOrders = orders.filter(o => o.userId === userId);
    
    res.json({
        success: true,
        count: userOrders.length,
        data: userOrders
    });
});

// GET /api/orders/:id - Get single order
router.get('/:id', (req, res, next) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    
    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        return next(error);
    }
    
    res.json({
        success: true,
        data: order
    });
});

module.exports = router;
