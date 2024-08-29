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

  const { creditCard } = req.body;

  const username = req.params.username;

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: `User ${username} not found`,
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message: `Forbidden, you are not ${username}`,
    });
  }

  const newCreditCard = await MyCreditCard.create({
    user,
    creditCard,
  });

  if (!newCreditCard) {
    return res.status(500).json({
      status: "error",
      message: `Error creating credit card for user ${username}`,
    });
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

  const username = req.params.username;

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: `User ${username} not found`,
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message: `Forbidden, you are not ${username}`,
    });
  }

  const retrievedCreditCard = await MyCreditCard.findOne({ user });

  if (!retrievedCreditCard) {
    return res.status(404).json({
      status: "error",
      message: `No credit card found for user ${username}`,
    });
  }

  const formattedCreditCard = await retrievedCreditCard.formatCreditCard();

  res.status(200).json({
    status: "success",
    message: `Registered credit card for user ${username} loaded successfully!`,
    data: {
      creditCard: formattedCreditCard || "Please enter a credit card number",
      updatedAt: retrievedCreditCard.updatedAt,
      _id: retrievedCreditCard._id,
    },
  });
});

exports.updateMyCreditCard = tryCatch(async (req, res, next) => {
  // Verificación del token de autenticación
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next({
      statusCode: 401,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return next({
      statusCode: 401,
      message: "Invalid token",
    });
  }

  const requesterId = decodedToken.user._id;
  const incomingCreditCard = req.body.creditCard;
  const username = req.params.username;

  console.log("Incoming Credit Card:", incomingCreditCard);

  // Buscar usuario vinculado
  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return next({
      statusCode: 404,
      message: `User ${username} not found`,
    });
  }

  const user = linkedUser._id;

  // Verificar que el usuario autenticado es el mismo que el dueño de la tarjeta
  if (requesterId !== user.toString()) {
    return next({
      statusCode: 403,
      message: `Forbidden, you are not ${username}`,
    });
  }

  // Buscar la tarjeta de crédito del usuario
  const retrievedCreditCard = await MyCreditCard.findOne({ user });

  if (!retrievedCreditCard) {
    return next({
      statusCode: 404,
      message: `No credit card found for user ${username}`,
    });
  }

  // Verificar que se ha proporcionado una nueva tarjeta de crédito válida
  if (incomingCreditCard) {
    retrievedCreditCard.creditCard = incomingCreditCard;
  } else {
    return next({
      statusCode: 400,
      message: "Please provide a valid credit card number",
    });
  }

  // Guardar la tarjeta de crédito actualizada
  try {
    const savedCard = await retrievedCreditCard.save({ runValidators: true });
    res.status(200).json({
      status: "success",
      message: `${username}'s credit card updated successfully!`,
      data: {
        creditCard: savedCard,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Manejo específico para errores de validación
      return next({
        statusCode: 400,
        message: error.message,
      });
    }
    // Manejo de otros errores
    return next({
      statusCode: 500,
      message: `Error updating credit card for user ${username}`,
    });
  }
});

exports.deleteMyCreditCard = tryCatch(async (req, res) => {
  const username = req.params.username;
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
  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: `User ${username} not found`,
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden, you are not the owner of this credit card",
    });
  }

  const retrievedCreditCard = await MyCreditCard.findOne({ user });

  if (!retrievedCreditCard) {
    return res.status(404).json({
      status: "error",
      message: `No credit card found for user ${username}`,
    });
  }

  const creditCardId = retrievedCreditCard._id;

  const deletedCreditCard = await MyCreditCard.deleteOne({ _id: creditCardId });

  if (deletedCreditCard.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: `Something went wrong, could not delete credit card for user ${username}`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `Credit card deleted for user ${username}`,
  });
});
