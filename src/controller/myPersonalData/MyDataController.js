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
  const username = req.user.username;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  if (requesterId !== user._id.toString()) {
    return res.status(403).json({
      status: "error",
      message: res.__("forbidden_not_owner", { username }),
    });
  }

  res.status(200).json({
    status: "success",
    message: res.__("user_data_loaded_successfully", { username }),
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
  const requesterName = decodedToken.user.username;

  const { username, email, birthdate, name, lastname, mobilePhoneNumber } =
    req.body;

  const usernameExists = await User.findOne({ username });
  if (usernameExists && usernameExists._id.toString() !== requesterId) {
    return res.status(400).json({
      status: "error",
      message: res.__("username_already_in_use"),
    });
  }

  const emailExists = await User.findOne({ email });
  if (emailExists && emailExists._id.toString() !== requesterId) {
    return res.status(400).json({
      status: "error",
      message: res.__("email_already_in_use"),
    });
  }

  const user = await User.findOne({ _id: requesterId });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: res.__("user_not_found", { username: requesterName }),
    });
  }

  if (requesterId !== user._id.toString()) {
    return res.status(403).json({
      status: "error",
      message: res.__("forbidden_not_owner", { username: requesterName }),
    });
  }

  const data = {
    username: username !== user.username ? username : user.username,
    email: email !== user.email ? email : user.email,
    birthdate: birthdate || user.birthdate,
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
      message: res.__("error_updating_user_data", { username: requesterName }),
    });
  }

  res.status(200).json({
    status: "success",
    message: res.__("success_user_data_updated", { username: requesterName }),
    data: {
      userData: {
        ...updatedUser.toObject(),
        birthdate: moment(updatedUser.birthdate).format("DD-MM-YYYY"), // Formatear antes de enviar
      },
    },
  });
});
