const User = require("../models/User");
const PublicProfile = require("../models/PublicProfile");
const { tryCatch } = require("../utils/tryCatch");
const MyAddress = require("../models/myPersonalData/MyAddress");
const MyCreditCard = require("../models/myPersonalData/MyCreditCard");

exports.getUsers = tryCatch(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});
// Cambiar a getMyAccount
exports.getMyAccount = tryCatch(async (req, res) => {
  const username = req.params.username;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      message: `User ${username} not found`,
    });
  }

  const address = await MyAddress.findOne({
    user: retrievedUser._id,
  }).populate({
    path: "user",
    select: "name lastname",
  });

  res.status(200).json({ address });
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

  try {
    const userPublicProfile = await PublicProfile.create({
      user: user._id,
      userPhoto: "UserTemplate.jpg",
      headerPhoto: "UserHeader.jpg",
      userDescription: "Your user description is empty",
    });

    const userAddress = await MyAddress.create({
      user: user._id,
      country: "Please add a country",
      streetName: "Add your street name",
      streetNumber: "Add your street number",
      flat: "Add your flat number",
      door: "Add your flat door",
      postalCode: "Add your postal code",
      mobilePhoneNumber: "123 123 123",
    });

    const userCreditCard = await MyCreditCard.create({
      user: user._id,
      creditCard: "423442344234423442",
    });

    const token = user.getSignedJwt();

    res.status(201).json({
      success: true,
      token,
      user,
      userAddress,
      userCreditCard,
      userPublicProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Could not create ${user.username} public profile`,
      error,
    });
  }
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
