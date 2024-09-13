const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const PublicProfile = require("../models/PublicProfile");
const { tryCatch } = require("../utils/tryCatch");
const MyAddress = require("../models/myPersonalData/MyAddress");
const MyCreditCard = require("../models/myPersonalData/MyCreditCard");
const path = require("path");
const fs = require("fs").promises;

exports.getUsers = tryCatch(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});

exports.getUser = tryCatch(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: res.__("provide_user_id"),
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: res.__("invalid_user_id"),
    });
}

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: res.__("user_not_found"),
    });
  }

  res.status(200).json({ user: {
    _id:userId,
    username: user.username,
  } });
});

exports.getUsersPublicProfiles = tryCatch(async (req, res) => {
  const users = await User.find();
  const usersPublicProfiles = users.map((user) => ({
    username: user.username,
    _id: user._id,
  }));
  res.status(200).json({ usersPublicProfiles });
});

exports.register = tryCatch(async (req, res) => {
  const {
    email,
    password,
    passwordConfirmation,
    role,
    username,
    birthdate,
    address,
  } = req.body;

  if (password !== passwordConfirmation) {
    return res.status(400).json({ message: res.__("passwords_do_not_match") });
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({
      message: res.__("user_already_registered", { username }),
    });
  }

  const existemail = await User.findOne({ email });

  if (existemail) {
    return res.status(400).json({
      message: res.__("email_already_registered", { email }),
    });
  }

  let user;

  try {
    user = await User.create({
      username,
      email,
      password,
      role,
      birthdate,
      name: process.env.USER_NAME_PLACEHOLDER || "------",
      lastname: process.env.USER_LAST_NAME_PLACEHOLDER || "------",
      mobilePhoneNumber: process.env.MOBILE_PHONE_NUMBER || "--- --- ---",
      address,
      creditCard: process.env.CREDIT_CARD_DEFAULT_PLACEHOLDER || "----",
    });
  } catch (error) {
    return res.status(500).json({
      message: res.__("failed_to_create_user", { username }),
      error,
    });
  }

  let userPublicProfile;

  try {
    userPublicProfile = await PublicProfile.create({
      user: user._id,
      userPhoto: "UserTemplate.jpg",
      headerPhoto: "UserHeader.jpg",
      userDescription: res.__("user_description_empty"),
    });
  } catch (error) {
    return res.status(500).json({
      message: res.__("could_not_create_public_profile", { username }),
      error,
    });
  }

  let userAddress;
  try {
    userAddress = await MyAddress.create({
      user: user._id,
      country: "None",
      streetName: "--",
      streetNumber: "--",
      flat: "--",
      door: "--",
      postalCode: "--",
      city: "--",
    });
  } catch (error) {
    return res.status(500).json({
      message: res.__("could_not_create_address", { username }),
      error,
    });
  }

  let userCreditCard;
  try {
    userCreditCard = await MyCreditCard.create({
      user: user._id,
      creditCard: "----",
    });
  } catch (error) {
    return res.status(500).json({
      message: res.__("could_not_create_credit_card", { username }),
      error,
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
      message: res.__("provide_valid_email_and_password"),
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next({
      message: res.__("invalid_user_credentials"),
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next({
      message: res.__("credentials_dont_match"),
    });
  }

  const token = user.getSignedJwt();

  res.status(201).json({
    success: true,
    token,
    userId: user._id,
    userName: user.username,
    updatedAt: user.updatedAt,
  });
});
