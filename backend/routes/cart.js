const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.get('/:userId', async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        res.json({ success: true, data: cart || { items: [] } });
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [{ productId, quantity }] });
        } else {
            const item = cart.items.find(i => i.productId.toString() === productId);
            if (item) {
                item.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
            await cart.save();
        }
        res.status(201).json({ success: true, data: cart });
    } catch (err) {
        next(err);
    }
});

router.delete('/:userId/:productId', async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (cart) {
            cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
            await cart.save();
        }
        res.json({ success: true, data: cart });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
