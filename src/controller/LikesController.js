const Like = require('../models/Like');
const { tryCatch } = require('../utils/tryCatch');

exports.setLike = tryCatch(async (req, res) => {
  const { adId } = req.body;
  const userId = req.user._id;

  const existingLike = await Like.findOne({ ad: adId, user: userId });
  if (existingLike) {
    const likeId = existingLike._id;
    await Like.findByIdAndDelete(likeId);
    res.status(204).json({ message: 'Like removed' });
  } else {
    const like = await Like.create({ ad: adId, user: userId });
    res.status(201).json({ like });
  }
});


exports.countLikes = tryCatch(async (req, res) => {
  const adId = req.params.id;
  const count = await Like.countDocuments({ ad: adId });
  res.status(200).json({ adId, count });
});

exports.getUserLikes = tryCatch(async (req, res) => {
  const userId =req.params.id;
  const likes = await Like.find({ user: userId }).populate('ad');
  res.status(200).json({ likes });
});