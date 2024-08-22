const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  commentText: {
    type: String,
    required: ['true', 'Please add comment text']
  },
  score: {
    type: Number,
    required: true,
      enum: {
        values: [0, 1, 2, 3, 4, 5],
      },
      default: 0,
  },
  fatherId: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
