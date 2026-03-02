const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [orderItemSchema],
    shippingAddress: { type: String, required: true },
    status: { type: String, default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
