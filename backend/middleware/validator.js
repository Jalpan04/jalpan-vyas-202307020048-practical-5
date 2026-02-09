/**
 * Validation Middleware
 * Uses Joi for request body validation
 */

const Joi = require('joi');

// Validation Schemas
const productSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).required(),
    price: Joi.number().positive().required(),
    image: Joi.string().required(),
    category: Joi.string().required(),
    stock: Joi.number().integer().min(0).required()
});

const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const cartItemSchema = Joi.object({
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().min(1).required()
});

const orderSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            productId: Joi.number().required(),
            quantity: Joi.number().required(),
            price: Joi.number().required()
        })
    ).min(1).required(),
    shippingAddress: Joi.string().required(),
    paymentMethod: Joi.string().valid('card', 'upi', 'cod').required()
});

// Middleware Functions
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            return next(err);
        }
        next();
    };
};

module.exports = {
    validateProduct: validate(productSchema),
    validateUser: validate(userSchema),
    validateLogin: validate(loginSchema),
    validateCartItem: validate(cartItemSchema),
    validateOrder: validate(orderSchema)
};
