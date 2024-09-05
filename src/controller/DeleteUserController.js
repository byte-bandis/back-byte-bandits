const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const PublicProfile = require("../models/PublicProfile");
const { tryCatch } = require("../utils/tryCatch");
const MyAddress = require("../models/myPersonalData/MyAddress");
const MyCreditCard = require("../models/myPersonalData/MyCreditCard");
const path = require("path");
const {
  default: generateRandomPassword,
} = require("../utils/generatePassword");
const fs = require("fs").promises;

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

  const logFilePath = path.join(__dirname, "..", "logs", "deletion_logs.txt");

  const logsDir = path.join(__dirname, "..", "logs");

  try {
    await fs.access(logsDir);
  } catch (error) {
    await fs.mkdir(logsDir);
  }

  const writeLog = async (message) => {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    try {
      await fs.appendFile(logFilePath, logMessage);
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
    await writeLog(logMessage);
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
    await writeLog(logMessage);
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
        await writeLog(logMessage);
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
        await writeLog(logMessage);
      }
    } catch (error) {
      const logMessage = `Error deleting image files for ${username}: ${error.message}`;
      console.error(logMessage);
      await writeLog(logMessage);
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
    await writeLog(logMessage);
  }

  const newUsername = `deleted_${account._id}`;
  const newEmail = `deleted_${account._id}@example.com`;
  const randomPassword = generateRandomPassword();
  const newPassword = await bcrypt.hash(randomPassword, 10);

  try {
    const anonymizedAccount = await User.updateOne(
      { _id: account._id },
      {
        username: newUsername,
        email: newEmail,
        password: newPassword,
      }
    );

    if (anonymizedAccount.nModified === 0) {
      return res.status(500).json({
        status: "error",
        message: res.__("something_went_wrong_anonymize_account", {
          username,
        }),
      });
    }

    const finalLogMessage = `Account for ${username} deleted successfully!`;
    console.log(finalLogMessage);
    await writeLog(finalLogMessage);

    res.status(200).json({
      status: "success",
      message: res.__("account_deleted_successfully", { username }),
    });
  } catch (error) {
    const errorMessage = `Error anonymizing account for ${username}: ${error.message}\n`;
    fs.appendFileSync(logFilePath, errorMessage);

    return res.status(500).json({
      status: "error",
      message: res.__("something_went_wrong_deleting_account", { username }),
    });
  }
});
