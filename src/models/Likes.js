const mongoose = require('mongoose');

const LikesSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user']
  },
  anuncio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anuncio',
    required: [true, 'Please add an anuncio']
  }
}, { timestamps: true });

module.exports = mongoose.model('Likes', LikesSchema);
