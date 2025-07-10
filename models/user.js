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
    admin: {
        type: Boolean,
        default: false
    },
    credit: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User