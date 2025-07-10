const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    ip: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'maintenance'],
        default: 'online'
    },
    capacity: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const Server = mongoose.model('Server', serverSchema);
module.exports = Server;