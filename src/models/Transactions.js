const mongoose = require('mongoose');

const TransactionsSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user']
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user']
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: [true, 'Please add an anuncio']
  },
  state : {
    type: String,
    enum: ['NoTrade', 'Ordered', 'Sold', 'Cancelled'],
    default: 'NoTrade'
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Like', LikeSchema);
