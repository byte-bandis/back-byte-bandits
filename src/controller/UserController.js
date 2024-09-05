const jwt = require("jsonwebtoken");
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
      message: res.__("invalid_credentials"),
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next({
      message: res.__("invalid_credentials"),
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

exports.deleteUser = tryCatch(async (req, res) => {
  const username = req.user.username;
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
  const account = await User.findOne({ username });

  if (!account) {
    return res.status(404).json({
      status: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  if (requesterId !== account._id.toString()) {
    return res.status(403).json({
      status: "error",
      message: res.__("forbidden_not_owner", { username }),
    });
  }

  // Ruta del archivo de log
  const logFilePath = path.join(__dirname, "..", "logs", "deletion_logs.txt");

  // Crear la carpeta logs si no existe (usando fs.promises)
  const logsDir = path.join(__dirname, "..", "logs");

  // Verificar si la carpeta logs existe
  try {
    await fs.access(logsDir); // Si la carpeta existe, no hace nada
  } catch (error) {
    await fs.mkdir(logsDir); // Si no existe, crea la carpeta
  }

  // Función para escribir en el archivo de log
  const writeLog = async (message) => {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    try {
      await fs.appendFile(logFilePath, logMessage); // Escribimos en el archivo de log de manera asíncrona
    } catch (error) {
      console.error("Error writing to log file:", error.message);
    }
  };

  const deletedAddress = await MyAddress.deleteOne({ user: account._id });
  if (deletedAddress.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: res.__("something_went_wrong_delete_address", { username }),
    });
  } else {
    const logMessage = `Address deleted for ${username}`;
    console.log(logMessage);
    await writeLog(logMessage); // Escribimos en el log de manera asíncrona
  }

  const deletedCreditCard = await MyCreditCard.deleteOne({ user: account._id });
  if (deletedCreditCard.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: res.__("something_went_wrong_delete_credit_card", { username }),
    });
  } else {
    const logMessage = `Credit card deleted for ${username}`;
    console.log(logMessage);
    await writeLog(logMessage); // Escribimos en el log de manera asíncrona
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
        const logMessage = `${username}'s image deleted successfully!`;
        console.log(logMessage);
        await writeLog(logMessage); // Escribimos en el log de manera asíncrona
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
        const logMessage = `${username}'s header image deleted successfully!`;
        console.log(logMessage);
        await writeLog(logMessage); // Escribimos en el log de manera asíncrona
      }
    } catch (error) {
      const logMessage = `Error deleting image files for ${username}: ${error.message}`;
      console.error(logMessage);
      await writeLog(logMessage); // Escribimos en el log de manera asíncrona
    }
  }

  const deletedPublicProfile = await PublicProfile.deleteOne({
    user: account._id,
  });

  if (deletedPublicProfile.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: res.__("something_went_wrong_delete_public_profile", {
        username,
      }),
    });
  } else {
    const logMessage = `Public Profile deleted for ${username}`;
    console.log(logMessage);
    await writeLog(logMessage); // Escribimos en el log de manera asíncrona
  }

  const deletedAccount = await User.deleteOne({ _id: account._id });
  if (deletedAccount.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: res.__("something_went_wrong_delete_account", { username }),
    });
  }

  // Escribimos el log final
  const finalLogMessage = `Account for ${username} deleted successfully!`;
  console.log(finalLogMessage);
  await writeLog(finalLogMessage); // Escribimos en el log de manera asíncrona

  res.status(200).json({
    status: "success",
    message: res.__("account_deleted_successfully", { username }),
  });
});
