const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { tryCatch } = require("../../utils/tryCatch");
const MyCreditCard = require("../../models/myPersonalData/MyCreditCard");
const {
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
  ServerError,
} = require("../../middleware/errors");

exports.createMyCreditCard = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    throw new UnauthorizedError("Invalid token");
  }

  const requesterId = decodedToken.user._id;

  const { creditCard } = req.body;

  const username = req.params.username;

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    throw new NotFoundError(`User ${username} not found`);
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    throw new ForbiddenError(`Forbidden, you are not ${username}`);
  }

  const newCreditCard = await MyCreditCard.create({
    user,
    creditCard,
  });

  if (!newCreditCard) {
    throw new ServerError(`Error creating credit card for user ${username}`);
  }

  res.status(200).json({
    status: "success",
    message: `New credit card created for user ${username}!`,
    data: {
      creditCard: newCreditCard,
    },
  });
});

exports.getMyCreditCard = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    throw new UnauthorizedError("Invalid token");
  }

  const requesterId = decodedToken.user._id;

  const username = req.params.username;

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    throw new NotFoundError(`User ${username} not found`);
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    throw new ForbiddenError(`Forbidden, you are not ${username}`);
  }

  const retrievedCreditCard = await MyCreditCard.findOne({ user });

  if (!retrievedCreditCard) {
    throw new ServerError(`No credit card found for user ${username}`);
  }

  const formattedCreditCard = await retrievedCreditCard.formatCreditCard();

  res.status(200).json({
    status: "success",
    message: `Registered credit card for user ${username} loaded successfully!`,
    data: {
      creditCard: formattedCreditCard,
    },
  });
});

exports.updateMyCreditCard = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    throw new UnauthorizedError("Invalid token");
  }

  const requesterId = decodedToken.user._id;
  const incomingCreditCard = req.body.creditCard;
  const username = req.params.username;

  const retrievedUser = await User.findOne({ username });
  if (!retrievedUser) {
    throw new NotFoundError(`User ${username} not found`);
  }

  const retrievedCreditCard = await MyCreditCard.findOne({
    user: retrievedUser._id,
  });

  if (!retrievedCreditCard) {
    throw new NotFoundError(`Credit card not found for ${username}`);
  }

  if (requesterId !== retrievedCreditCard.user.toString()) {
    throw new ForbiddenError(
      "Forbidden, you are not the owner of this credit card"
    );
  }

  if (incomingCreditCard) {
    retrievedCreditCard.creditCard = incomingCreditCard;
  }

  try {
    await retrievedCreditCard.save();
  } catch (error) {
    throw new ServerError(`Could not update ${username}'s credit card`);
  }

  res.status(200).json({
    status: "success",
    message: `${username}'s credit card updated successfully!`,
    data: {
      creditCard: retrievedCreditCard,
    },
  });
});

exports.deleteMyCreditCard = tryCatch(async (req, res) => {
  const username = req.params.username;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization token is missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const requesterId = decodedToken.user._id;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    throw new NotFoundError(`User ${username} not found`);
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    throw new ForbiddenError(
      "Forbidden, you are not the owner of this credit card"
    );
  }

  const retrievedCreditCard = await MyCreditCard.findOne({ user });

  if (!retrievedCreditCard) {
    throw new NotFoundError(`User ${username} doesn't have a credit card`);
  }

  const creditCardId = retrievedCreditCard._id;

  const deletedCreditCard = await MyCreditCard.deleteOne({ _id: creditCardId });

  if (deletedCreditCard.deletedCount === 0) {
    throw new ServerError(
      `Something went wrong, could not delete credit card for user ${username}`
    );
  }

  res.status(200).json({
    status: "success",
    message: `Credit card deleted for user ${username}`,
  });
});
