const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { tryCatch } = require("../../utils/tryCatch");
const MyCreditCard = require("../../models/myPersonalData/MyCreditCard");

exports.createMyCreditCard = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;

  const { creditCard } = req.body;

  const username = req.params.username;

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message: res.__("forbidden_not_owner", { username }),
    });
  }

  const newCreditCard = await MyCreditCard.create({
    user,
    creditCard,
  });

  if (!newCreditCard) {
    return res.status(500).json({
      status: "error",
      message: res.__("error_creating_credit_card", { username }),
    });
  }

  res.status(200).json({
    status: "success",
    message: res.__("success_credit_card_created", { username }),
    data: {
      creditCard: newCreditCard,
    },
  });
});

exports.getMyCreditCard = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;

  const username = req.params.username;

  const linkedUser = await User.findOne({ _id: requesterId });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message: res.__("forbidden_not_owner", { username }),
    });
  }

  const retrievedCreditCard = await MyCreditCard.findOne({ user });

  if (!retrievedCreditCard) {
    return res.status(404).json({
      status: "error",
      message: res.__("no_credit_card_found", { username }),
    });
  }

  console.log("retrievedCreditcard: ", retrievedCreditCard);
  console.log(
    "retrievedCreditcard.last4Digits: ",
    retrievedCreditCard.last4Digits
  );

  res.status(200).json({
    status: "success",
    message: res.__("success_credit_card_loaded", { username }),
    data: {
      creditCard: retrievedCreditCard.last4Digits
        ? `**********${retrievedCreditCard.last4Digits}`
        : "------",
      updatedAt: retrievedCreditCard.updatedAt,
      _id: retrievedCreditCard._id,
    },
  });
});

exports.updateMyCreditCard = tryCatch(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      state: "error",
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      state: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const incomingCreditCard = req.body.creditCard;
  const username = req.params.username;

  const linkedUser = await User.findOne({ _id: requesterId });

  if (!linkedUser) {
    return res.status(404).json({
      state: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      state: "error",
      message: res.__("forbidden_not_owner", { username }),
    });
  }

  const retrievedCreditCard = await MyCreditCard.findOne({ user });

  if (!retrievedCreditCard) {
    return res.status(404).json({
      state: "error",
      message: res.__("no_credit_card_found", { username }),
    });
  }

  if (incomingCreditCard) {
    retrievedCreditCard.creditCard = incomingCreditCard;
  }
  /*  else {
    return res.status(400).json({
      state: "error",
      message: res.__("provide_valid_credit_card_number"),
    });
  } */

  const savedCard = await retrievedCreditCard.save();

  if (savedCard) {
    console.log("savedCard: ", savedCard);
    console.log("savedCard.last4Digits: ", savedCard.last4Digits);
    res.status(200).json({
      status: "success",
      message: res.__("success_credit_card_updated", { username }),
      data: {
        creditCard: savedCard.creditCard
          ? `**********${savedCard.last4Digits}`
          : "------",
      },
    });
  } else {
    return res.status(500).json({
      state: "error",
      message: res.__("error_updating_credit_card", { username }),
    });
  }
});

exports.deleteMyCreditCard = tryCatch(async (req, res) => {
  const username = req.params.username;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("invalid_token"),
    });
  }
  const requesterId = decodedToken.user._id;
  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message: res.__("forbidden_not_owner", { username }),
    });
  }

  const retrievedCreditCard = await MyCreditCard.findOne({ user });

  if (!retrievedCreditCard) {
    return res.status(404).json({
      status: "error",
      message: res.__("no_credit_card_found", { username }),
    });
  }

  const creditCardId = retrievedCreditCard._id;

  const deletedCreditCard = await MyCreditCard.deleteOne({ _id: creditCardId });

  if (deletedCreditCard.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: res.__("something_went_wrong_delete_credit_card", { username }),
    });
  }

  res.status(200).json({
    status: "success",
    message: res.__("success_credit_card_deleted", { username }),
  });
});
