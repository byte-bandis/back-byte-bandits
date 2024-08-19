const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PublicProfile = require("../models/PublicProfile");
const { tryCatch } = require("../utils/tryCatch");

exports.createPublicProfile = tryCatch(async (req, res) => {
  const { requesterId, userDescription } = req.body;
  const username = req.params.username;

  const userPhoto = req.files["userPhoto"]
    ? req.files["userPhoto"][0].filename
    : "";
  const headerPhoto = req.files["headerPhoto"]
    ? req.files["headerPhoto"][0].filename
    : "";

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      message: `User ${username} not found`,
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(401).json({
      message: `Forbidden, you are not ${username}`,
    });
  }

  const newPublicProfile = await PublicProfile.create({
    user,
    username,
    userPhoto,
    headerPhoto,
    userDescription,
  });

  res.status(200).json({
    newPublicProfile,
    message: `Public profile created for user ${username}!`,
  });
});

exports.getSinglePublicProfile = tryCatch(async (req, res) => {
  const username = req.params.username;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      message: `User ${username} not found`,
    });
  }

  let singlePublicProfile = await PublicProfile.findOne({
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

  const imagesFolder = "public/images/profiles";
  singlePublicProfile = {
    ...singlePublicProfile._doc,
    userPhoto: `http://${req.headers.host}/${imagesFolder}/${singlePublicProfile.userPhoto}`,
    headerPhoto: `http://${req.headers.host}/${imagesFolder}/${singlePublicProfile.headerPhoto}`,
  };

  res.status(200).json({
    publicProfileLoaded: {
      userPhoto: singlePublicProfile.userPhoto,
      userName: singlePublicProfile.user.username,
      headerPhoto: singlePublicProfile.headerPhoto,
      userDescription: singlePublicProfile.userDescription,
    },
    message: `Public profile for ${username} loaded successfully!`,
  });
});

exports.updatePublicProfile = tryCatch(async (req, res) => {
  const { requesterId, userDescription } = req.body;
  const incomingUserDescription = userDescription;

  const incomingUserPhoto = req.files["userPhoto"]
    ? req.files["userPhoto"][0].filename
    : "";
  const incomingHeaderPhoto = req.files["headerPhoto"]
    ? req.files["headerPhoto"][0].filename
    : "";

  const username = req.params.username;

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

  const data = {
    userPhoto:
      incomingUserPhoto && retrievedProfile.userPhoto !== incomingUserPhoto
        ? incomingUserPhoto
        : retrievedProfile.userPhoto,
    headerPhoto:
      incomingHeaderPhoto &&
      retrievedProfile.headerPhoto !== incomingHeaderPhoto
        ? incomingHeaderPhoto
        : retrievedProfile.headerPhoto,
    userDescription:
      incomingUserDescription &&
      retrievedProfile.userDescription !== incomingUserDescription
        ? incomingUserDescription
        : retrievedProfile.userDescription,
  };

  const updatedPublicProfile = await PublicProfile.findByIdAndUpdate(
    retrievedProfile._id,
    data,
    { new: true }
  );

  res.status(200).json({
    updatedPublicProfile,
    message: `${username}'s profile updated successfully!!`,
  });
});

/* exports.deletePublicProfile = tryCatch(async (req, res) => {
  const username = req.params.username;
  const requesterId = req.query.requesterId;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      message: `User ${username} not found`,
    });
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(401).json({
      message: "Forbidden, you are not the owner of this profile",
    });
  }

  const retrievedProfile = await PublicProfile.findOne({ user });

  if (!retrievedProfile) {
    return res.status(404).json({
      message: `User ${username} doesn't have a public profile`,
    });
  }

  await PublicProfile.deleteOne({ user });

  res.status(200).json({
    message: `Public profile deleted for user ${username}`,
  });
}); */

exports.deletePublicProfile = tryCatch(async (req, res) => {
  const username = req.params.username;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token is missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Token verification failed",
    });
  }

  const requesterId = decodedToken.user._id; // Asume que el `requesterId` está en el campo `id` del payload del token

  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      message: `User ${username} not found`,
    });
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      message: "Forbidden, you are not the owner of this profile",
    });
  }

  const retrievedProfile = await PublicProfile.findOne({ user });

  if (!retrievedProfile) {
    return res.status(404).json({
      message: `User ${username} doesn't have a public profile`,
    });
  }

  await PublicProfile.deleteOne({ user });

  res.status(200).json({
    message: `Public profile deleted for user ${username}`,
  });
});
