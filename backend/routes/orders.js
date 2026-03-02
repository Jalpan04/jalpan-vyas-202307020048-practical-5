const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res, next) => {
    try {
        const { userId, items, shippingAddress } = req.body;
        const order = await Order.create({ userId, items, shippingAddress });
        res.status(201).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const orders = await Order.find().populate('items.productId');
        res.json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.productId');
        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            return next(error);
        }
        res.json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            return next(error);
        }
        res.json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
