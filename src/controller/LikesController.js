const Like = require('../models/Like');
const { tryCatch } = require('../utils/tryCatch');
const User = require("../models/User")
const APIFeatures = require("../utils/ApiFeature");

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
  const userName = req.params.username;
  console.log({ username: userName })

  const user = await User.findOne({ username: userName });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const query = Like.find({user: user._id}).populate("ad")

  const advancedQuery = new APIFeatures(query, req.query).filter().paginate()
 
  // const likes = await Like.find({ user: user._id }).populate('ad');

  const likes = await advancedQuery.query.exec()
  console.log("Imprimo likes", likes)

  res.status(200).json({ likes });
});
