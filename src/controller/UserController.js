const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PublicProfile = require("../models/PublicProfile");
const { tryCatch } = require("../utils/tryCatch");
const MyAddress = require("../models/myPersonalData/MyAddress");
const MyCreditCard = require("../models/myPersonalData/MyCreditCard");

exports.getUsers = tryCatch(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});

// Esto está a medias
exports.getUsersPublicProfiles = tryCatch(async (req, res) => {
  const users = await User.find();
  const usersPublicProfiles = users.map((user) => {
    return {
      username: user.username,
      _id: user._id,
    };
  });
  res.status(200).json({ usersPublicProfiles });
});

exports.register = tryCatch(async (req, res) => {
  const {
    name,
    email,
    password,
    passwordConfirmation,
    role,
    username,
    lastname,
    birthdate,
    address,
    creditCard,
  } = req.body;

  if (password !== passwordConfirmation) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({
      message: `${username} already exists. Try a different username as ${username}_1 or ${username}2024`,
    });
  }

  const existemail = await User.findOne({ email });
  console.log(existemail);

  if (existemail) {
    return res.status(400).json({ message: `${email} is already registered.` });
  }

  let user;

  try {
    user = await User.create({
      name,
      email,
      password,
      role,
      username,
      lastname,
      birthdate,
      address,
      creditCard,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user.", error });
  }

  let userPublicProfile;

  try {
    userPublicProfile = await PublicProfile.create({
      user: user._id,
      userPhoto: "UserTemplate.jpg",
      headerPhoto: "UserHeader.jpg",
      userDescription: "Your user description is empty",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Could not create ${user.username} default public profile`,
      error,
    });
  }

  let userAddress;
  try {
    userAddress = await MyAddress.create({
      user: user._id,
      country: "Please add a country",
      streetName: "Add your street name",
      streetNumber: "Add your street number",
      flat: "Add your flat number",
      door: "Add your flat door",
      postalCode: "Add your postal code",
      city: "Add your city",
      mobilePhoneNumber: "123 123 123",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Could not create ${user.username} default address`,
      error,
    });
  }

  let userCreditCard;
  try {
    userCreditCard = await MyCreditCard.create({
      user: user._id,
      creditCard: "card",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Could not create ${user.username} default credit card`,
    });
  }

  const token = user.getSignedJwt();

  res.status(201).json({
    success: true,
    token,
    user,
    userAddress,
    userCreditCard,
    userPublicProfile,
  });
});

exports.login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next({
      message: "Please provide valid email and password.",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next({
      message: "Invalid Credentials",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next({
      message: "Invalid Credentials",
    });
  }

  const token = user.getSignedJwt();

  res.status(201).json({
    success: true,
    token,
    userId: user._id,
    userName: user.username,
  });
});

exports.deleteUser = tryCatch(async (req, res) => {
  //const username = req.params.username;
  const username = req.user.username;

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }
  const requesterId = decodedToken.user._id;
  const account = await User.findOne({ username });

  if (!account) {
    return res.status(404).json({
      status: "error",
      message: `Account for ${username} not found`,
    });
  }

  if (requesterId !== account._id.toString()) {
    return res.status(403).json({
      status: "error",
      message: `Forbidden, you are not the owner of ${username}'s account`,
    });
  }

  const deletedAddress = await MyAddress.deleteOne({ user: account._id });

  if (deletedAddress.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: `Something went wrong, could not delete address for user ${username}`,
    });
  } else {
    console.log(`Address deleted for ${username}`);
  }

  const deletedCreditCard = await MyCreditCard.deleteOne({ user: account._id });

  if (deletedCreditCard.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: `Something went wrong, could not delete credit card for ${username}`,
    });
  } else {
    console.log(`Credit card deleted for ${username}`);
  }

  const linkedPublicProfile = await PublicProfile.findOne({
    user: account._id,
  });

  if (linkedPublicProfile) {
    try {
      if (
        linkedPublicProfile.userPhoto &&
        linkedPublicProfile.userPhoto !== "UserTemplate.jpg"
      ) {
        const userPhotoPath = path.join(
          __dirname,
          "..",
          "public",
          "images",
          "profiles",
          linkedPublicProfile.userPhoto
        );
        await fs.unlink(userPhotoPath);
        console.log(`${username}'s image deleted successfully now!`);
      }

      if (
        linkedPublicProfile.headerPhoto &&
        linkedPublicProfile.headerPhoto !== "UserHeader.jpg"
      ) {
        const headerPhotoPath = path.join(
          __dirname,
          "..",
          "public",
          "images",
          "profiles",
          linkedPublicProfile.headerPhoto
        );
        await fs.unlink(headerPhotoPath);
        console.log(`${username}'s header image deleted successfully now!`);
      }
    } catch (error) {
      console.error("Error deleting image files:", error.message);
    }
  }

  const deletedPublicProfile = await PublicProfile.deleteOne({
    user: account._id,
  });

  if (deletedPublicProfile.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: `Something went wrong, could not delete public profile for ${username}`,
    });
  } else {
    console.log(`Public Profile deleted for ${username}`);
  }

  const deletedAccount = await User.deleteOne({ _id: account._id });

  if (deletedAccount.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: `Something went wrong, could not delete account for user ${username}`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `Account deleted for user ${username}`,
  });
});
