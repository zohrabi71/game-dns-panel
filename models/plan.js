const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    credit: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountedPrice: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ['active', 'disactive'],
        default: 'active'
    },
}, { timestamps: true })

const Plan = mongoose.model('Plan', planSchema)

module.exports = Plan