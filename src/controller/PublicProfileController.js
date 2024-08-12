const User = require("../models/User");
const PublicProfile = require("../models/PublicProfile");
const { tryCatch } = require("../utils/tryCatch");

exports.createPublicProfile = tryCatch(async (req, res) => {
  const { user, username, userPhoto, headerPhoto, userDescription } = req.body;
  const linkedUser = await User.findById(user);

  if (!linkedUser) {
    return res.status(404).json({
      message: `User with ID ${user} not found`,
    });
  }

  const newPublicProfile = await PublicProfile.create({
    user,
    username,
    userPhoto,
    headerPhoto,
    userDescription,
  });

  res.status(200).json(newPublicProfile);
});

exports.getSinglePublicProfile = tryCatch(async (req, res) => {
  const username = req.params.username;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      message: `User ${username} not found`,
    });
  }

  const singlePublicProfile = await PublicProfile.findOne({
    user: retrievedUser._id,
  }).populate({
    path: "user",
    select: "username",
  });

  if (!singlePublicProfile) {
    return res.status(404).json({
      message: `Profile not found for user ${username}`,
    });
  }

  res.status(200).json({
    userPhoto: singlePublicProfile.userPhoto,
    userName: singlePublicProfile.user.username,
    headerPhoto: singlePublicProfile.headerPhoto,
    userDescription: singlePublicProfile.userDescription,
  });
});
