const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId, ref: 'Ad',
        required: [true, 'Please add product id']
    },
    buyer: {
        type: mongoose.Schema.ObjectId, ref: 'User',
        required: [true, 'Please add buyer id'],
        index: true
    },
    seller: {
        type: mongoose.Schema.ObjectId, ref: 'User',
        required: [true, 'Please add seller id'],
        index: true
    },
    messages: [{
        user: {
            type: mongoose.Schema.ObjectId, ref: 'User',
            required: [true, 'Please add user id']
        },
        content: {
            type: String,
            required: [true, 'Please add message']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Boolean,
            default: false
        }
    }]
}, {timestamps: true});

module.exports = mongoose.model("Chat", ChatSchema);