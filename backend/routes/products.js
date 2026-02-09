const express = require('express');
const router = express.Router();
const { validateProduct } = require('../middleware/validator');

// Product Data (In-Memory)
let products = [
    {
        id: 1,
        name: 'VOLT Original',
        description: 'Classic energy boost with citrus flavor',
        price: 149,
        image: 'volt_original_can_1770608461155.png',
        category: 'Classic',
        stock: 100
    },
    {
        id: 2,
        name: 'VOLT Zero',
        description: 'Zero sugar, maximum energy',
        price: 159,
        image: 'volt_zero_can_1770608474629.png',
        category: 'Sugar-Free',
        stock: 85
    },
    {
        id: 3,
        name: 'VOLT Tropical',
        description: 'Exotic tropical fruit blend',
        price: 169,
        image: 'volt_tropical_can_1770608488669.png',
        category: 'Flavored',
        stock: 60
    },
    {
        id: 4,
        name: 'VOLT Extreme',
        description: 'Maximum caffeine for extreme performance',
        price: 199,
        image: 'volt_zero_can_1770608474629.png',
        category: 'Performance',
        stock: 45
    },
    {
        id: 5,
        name: 'VOLT Berry Blast',
        description: 'Mixed berry explosion',
        price: 169,
        image: 'volt_berry_can_1770608507764.png',
        category: 'Flavored',
        stock: 70
    },
    {
        id: 6,
        name: 'VOLT Mango Rush',
        description: 'Tropical mango energy',
        price: 169,
        image: 'volt_mango_can_1770608525217.png',
        category: 'Flavored',
        stock: 55
    }
];

// GET all products
router.get('/', (req, res) => {
    res.json({ success: true, count: products.length, data: products });
});

// GET single product
router.get('/:id', (req, res, next) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        return next(error);
    }
    res.json({ success: true, data: product });
});

// POST new product
router.post('/', validateProduct, (req, res) => {
    const newProduct = { ...req.body, id: products.length + 1 };
    products.push(newProduct);
    res.status(201).json({ success: true, message: 'Product added', data: newProduct });
});

module.exports = router;
