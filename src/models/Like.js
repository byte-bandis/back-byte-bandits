const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user']
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: [true, 'Please add an anuncio']
  }
}, { timestamps: true });

module.exports = mongoose.model('Like', LikeSchema);
