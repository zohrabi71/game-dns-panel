const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 254
    },
    password: {
        type: String,
        required: true,
        maxlength: 128
    },
    server: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
    },
    payCash: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    admin: {
        type: Boolean,
        default: false
    },
    subscription: {
        start: {
            type: Date
        },
        end: {
            type: Date
        },
        status: {
            type: String,
            enum: ['active', 'disactive'],
            default: 'disactive'
        },
    },
    ips: {
        type: [String],
        default: []
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User