const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { validateProduct } = require('../middleware/validator');

router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json({ success: true, count: products.length, data: products });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            return next(error);
        }
        res.json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
});

router.post('/', validateProduct, async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            return next(error);
        }
        res.json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            return next(error);
        }
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
