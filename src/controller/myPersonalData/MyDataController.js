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
        name: user.name === "" ? "------" : user.name,
        lastname: user.lastname === "" ? "------" : user.lastname,
        email: user.email,
        mobilePhoneNumber:
          user.mobilePhoneNumber === ""
            ? "--- --- ---"
            : user.mobilePhoneNumber,
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
  const requesterName = decodedToken.user.username;
  console.log("Esto es requesterName: ", requesterName);

  const { username, email, birthdate, name, lastname, mobilePhoneNumber } =
    req.body;

  const usernameExists = await User.findOne({ username });
  if (usernameExists && usernameExists._id.toString() !== requesterId) {
    res.status(400).json({
      status: "error",
      message: "This name is already in use, please choose a different one",
    });
  }

  const emailExists = await User.findOne({ email });
  if (emailExists && emailExists._id.toString() !== requesterId) {
    res.status(400).json({
      status: "error",
      message: "This email is already in use, please choose a different one",
    });
  }

  let parsedBirthdate = null;
  if (birthdate) {
    if (moment(birthdate, "DD-MM-YYYY", true).isValid()) {
      parsedBirthdate = moment(birthdate, "DD-MM-YYYY").toDate(); // Convertir a Date si es válido
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid birthdate format. Expected format is DD-MM-YYYY.",
      });
    }
  }

  const user = await User.findOne({ username: requesterName });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: `User ${requesterName} not found`,
    });
  }

  if (requesterId !== user._id.toString()) {
    return res.status(403).json({
      status: "error",
      message: `Forbidden, you are not ${requesterId}`,
    });
  }

  const data = {
    username: username !== user.username ? username : user.username,
    email: email !== user.email ? email : user.email,
    birthdate: parsedBirthdate || user.birthdate,
    name: name !== user.name ? name : user.name,
    lastname: lastname !== user.lastname ? lastname : user.lastname,
    mobilePhoneNumber:
      mobilePhoneNumber !== user.mobilePhoneNumber
        ? mobilePhoneNumber
        : user.mobilePhoneNumber,
  };

  const updatedUser = await User.findByIdAndUpdate(user._id, data, {
    new: true,
  });

  if (!updatedUser) {
    return res.status(500).json({
      status: "error",
      message: `Could not update ${requesterName}'s data`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `${requesterName}'s data updated successfully!!`,
    data: {
      userData: {
        ...updatedUser.toObject(),
        birthdate: moment(updatedUser.birthdate).format("DD-MM-YYYY"), // Formatear antes de enviar
      },
    },
  });
});
