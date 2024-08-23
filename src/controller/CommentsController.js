const Comment = require('../models/Comment');
const { tryCatch } = require('../utils/tryCatch');
import Ad from '../models/Ad';

exports.getComments = tryCatch(async (req, res, next) => {
  const fatherId  = req.params.id;
  console.log(fatherId);

  if (!fatherId) {
    return next({
      message: 'Father id not given'
    });
  }
  const comments = await Comment.find({ fatherId }).populate({
    path: 'user'
  }).sort('-createdAt');
  if (!comments) {
    return next({
      message: 'Comments not found'
    });
  }

  res.status(200).json({
    success: true,
    data: comments
  });
});
/* 
exports.getComment = tryCatch(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id)
    .populate({
      path: 'post',
      select: 'postTitle duration',
      populate: {
        path: 'user',
        select: 'name email'
      }
    })
    .populate({
      path: 'user'
    });

  if (!comment) {
    return next({
      message: 'Comment not found'
    });
  }

  res.status(200).json({
    success: true,
    data: comment
  });
}); */

exports.addComment = tryCatch(async (req, res, next) => {
  const fatherId  = req.params.id;
  const user = req.user._id;

  const currentAd = await Ad.findById(fatherId);
 
  if (!currentAd) {
    return next({
      message: 'Ad not found'
    });
  }

  const comment = await Comment.create({ ...req.body, user, fatherId });
  const newComment = await Comment.findById(comment._id).populate({
    path: 'user'
  })
  res.status(200).json({
    success: true,
    data: newComment
  });
});

exports.updateComment = tryCatch(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next({
      message: 'Comment not found'
    });
  }
  if (comment.user.toString() !== req.user._id) {
    return next({
      message: 'Not authorized to update the comment'
    });
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  comment.save();

  res.status(200).json({
    success: true,
    data: comment
  });
});

exports.deleteComment = tryCatch(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next({
      message: 'Comment not found'
    });
  }
  if (comment.user.toString() !== req.user._id) {
    return next({
      message: 'Not authorized to delete the comment'
    });
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
