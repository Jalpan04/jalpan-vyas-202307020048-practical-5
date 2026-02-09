/**
 * VOLT Energy - Backend Server
 * Main entry point for the Express application
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import Routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

// Import Error Handler Middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// MIDDLEWARE
// =====================

// Enable CORS for frontend requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Request logging (Morgan)
app.use(morgan('dev'));

// =====================
// ROUTES
// =====================

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to VOLT Energy API',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            users: '/api/users',
            cart: '/api/cart',
            orders: '/api/orders'
        }
    });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Global Error Handler
app.use(errorHandler);

// =====================
// START SERVER
// =====================

app.listen(PORT, () => {
    console.log(`
    =======================================
    VOLT Energy API Server
    =======================================
    Status: Running
    Port: ${PORT}
    URL: http://localhost:${PORT}
    =======================================
    `);
});

module.exports = app;
