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

exports.updatePublicProfile = tryCatch(async (req, res) => {
  const { requesterId, userPhoto, headerPhoto, userDescription } = req.body;

  const username = req.params.username;

  const data = {
    userPhoto,
    headerPhoto,
    userDescription,
  };

  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      message: `User ${username} not found`,
    });
  }

  const retrievedProfile = await PublicProfile.findOne({
    user: retrievedUser._id,
  });

  if (!retrievedProfile) {
    return res.status(404).json({
      message: `Profile not found for ${username}`,
    });
  }

  if (requesterId !== retrievedProfile.user.toString()) {
    return res.status(401).json({
      message: "Forbidden, you are not the owner of this profile",
    });
  }

  const updatedPublicProfile = await PublicProfile.findByIdAndUpdate(
    retrievedProfile._id,
    data,
    { new: true }
  );

  res.status(200).json({
    updatedPublicProfile,
  });
});
