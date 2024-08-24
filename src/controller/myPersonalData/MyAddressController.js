const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const PublicProfile = require("../../models/PublicProfile");
const { tryCatch } = require("../../utils/tryCatch");
const fs = require("fs").promises;
const path = require("node:path");
const MyAddress = require("../../models/myPersonalData/MyAddress");

exports.createMyAddress = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const requesterId = decodedToken.user._id;
  const {
    country,
    streetName,
    streetNumber,
    flat,
    door,
    postalCode,
    mobilePhoneNumber,
  } = req.body;

  const username = req.params.username;

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

  try {
    const newAddress = await MyAddress.create({
      user,
      country,
      streetName,
      streetNumber,
      flat,
      door,
      postalCode,
      mobilePhoneNumber,
    });

    res.status(200).json({
      success: true,
      data: newAddress,
      message: `New address created for user ${username}!`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error creating address for user ${username}!`,
    });
  }
});

exports.getMyAddress = tryCatch(async (req, res) => {
  const username = req.params.username;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      message: `User ${username} not found`,
    });
  }

  const myAddress = await MyAddress.findOne({
    user: retrievedUser._id,
  }).populate({
    path: "user",
    select: "username",
  });

  if (!myAddress) {
    return res.status(404).json({
      message: `Address not found for user ${username}`,
    });
  }

  res.status(200).json({
    success: true,
    data: {
      addressId: myAddress._id,
      userId: myAddress.user._id,
      username: myAddress.user.username,
      country: myAddress.country,
      streetName: myAddress.streetName,
      streetNumber: myAddress.streetNumber,
      flat: myAddress.flat,
      door: myAddress.door,
      postalCode: myAddress.postalCode,
      mobilePhoneNumber: myAddress.mobilePhoneNumber,
      updatedAt: myAddress.updatedAt,
    },
    message: `Registered address for ${username} loaded successfully!`,
  });
});

exports.updateMyAddress = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const requesterId = decodedToken.user._id;
  const incomingUserDescription = req.body.userDescription;

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
    userPhoto: incomingUserPhoto || retrievedProfile.userPhoto,
    headerPhoto: incomingHeaderPhoto || retrievedProfile.headerPhoto,

    userDescription:
      (incomingUserDescription &&
        retrievedProfile.userDescription !== incomingUserDescription) ||
      incomingUserDescription === ""
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

  const requesterId = decodedToken.user._id;
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

  try {
    if (
      retrievedProfile.userPhoto &&
      retrievedProfile.userPhoto !== "UserTemplate.jpg"
    ) {
      const userPhotoPath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "profiles",
        retrievedProfile.userPhoto
      );
      await fs.unlink(userPhotoPath);
      console.log(`${username}'s image deleted successfully now!`);
    }

    if (
      retrievedProfile.headerPhoto &&
      retrievedProfile.headerPhoto !== "UserHeader.jpg"
    ) {
      const headerPhotoPath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "profiles",
        retrievedProfile.headerPhoto
      );
      await fs.unlink(headerPhotoPath);
      console.log(`${username}'s header image deleted successfully now!`);
    }
  } catch (error) {
    console.error("Error deleting image files:", error.message);
  }

  await PublicProfile.deleteOne({ user });

  res.status(200).json({
    message: `Public profile deleted for user ${username}`,
  });
});
