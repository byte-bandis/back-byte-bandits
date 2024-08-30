const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { tryCatch } = require("../../utils/tryCatch");
const moment = require("moment");

exports.getMyData = tryCatch(async (req, res) => {
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

  //const username = req.params.username;
  const username = req.user.username;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: `User ${username} not found`,
    });
  }

  if (requesterId !== user._id.toString()) {
    return res.status(403).json({
      status: "error",
      message: `Forbidden, you are not ${username}`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `Registered data for ${username} loaded successfully!`,
    data: {
      userData: {
        username: user.username,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        password: "******",
        birthdate: user.birthdate,
        updatedAt: user.updatedAt,
        _id: user._id,
      },
    },
  });
});

exports.updateMyData = tryCatch(async (req, res) => {
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
  const { username, email, birthdate, name, lastname } = req.body;

  // Verificación y manejo de fecha
  let parsedBirthdate = null;
  if (birthdate) {
    if (moment(birthdate, "DD-MM-YYYY", true).isValid()) {
      // Verificar si el formato es correcto
      parsedBirthdate = moment(birthdate, "DD-MM-YYYY").toDate(); // Convertir a Date si es válido
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid birthdate format. Expected format is DD-MM-YYYY.",
      });
    }
  }

  const user = await User.findOne({ username: req.params.username });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: `User ${username} not found`,
    });
  }

  if (requesterId !== user._id.toString()) {
    return res.status(403).json({
      status: "error",
      message: `Forbidden, you are not ${username}`,
    });
  }

  const data = {
    username: username !== user.username ? username : user.username,
    email: email !== user.email ? email : user.email,
    birthdate: parsedBirthdate || user.birthdate,
    name: name !== user.name ? name : user.name,
    lastname: lastname !== user.lastname ? lastname : user.lastname,
  };

  const updatedUser = await User.findByIdAndUpdate(user._id, data, {
    new: true,
  });

  if (!updatedUser) {
    return res.status(500).json({
      status: "error",
      message: `Could not update ${username}'s data`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `${username}'s data updated successfully!!`,
    data: {
      userData: {
        ...updatedUser.toObject(),
        birthdate: moment(updatedUser.birthdate).format("DD-MM-YYYY"), // Formatear antes de enviar
      },
    },
  });
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
