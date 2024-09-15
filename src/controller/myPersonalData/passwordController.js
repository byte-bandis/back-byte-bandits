const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { tryCatch } = require("../../utils/tryCatch");

exports.updateMyPassword = tryCatch(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      state: "error",
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      state: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      state: "error",
      message: res.__("missing_password_fields"),
    });
  }
  const username = req.user.username;

  const linkedUser = await User.findOne({ _id: requesterId }).select(
    "+password"
  );

  if (!linkedUser) {
    return res.status(404).json({
      state: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  if (requesterId !== linkedUser._id.toString()) {
    return res.status(403).json({
      state: "error",
      message: res.__("forbidden_not_owner", { username }),
    });
  }

  const isMatch = await bcrypt.compare(currentPassword, linkedUser.password);
  if (!isMatch) {
    return res.status(400).json({
      state: "error",
      message: res.__("incorrect_current_password"),
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  linkedUser.password = hashedPassword;

  try {
    await linkedUser.save();
    res.status(200).json({
      state: "success",
      message: res.__("success_password_updated", {
        username: linkedUser.username,
      }),
      data: {
        updatedAt: linkedUser.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      state: "error",
      message: res.__("error_updating_password", { username }),
    });
  }
});

exports.matchMyPassword = tryCatch(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      state: "error",
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      state: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const { currentPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({
      state: "error",
      message: res.__("missing_confirm_password_field"),
    });
  }

  const username = req.user.username;
  const linkedUser = await User.findOne({ _id: requesterId }).select(
    "+password"
  );

  if (!linkedUser) {
    return res.status(404).json({
      state: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  if (requesterId !== linkedUser._id.toString()) {
    return res.status(403).json({
      state: "error",
      message: res.__("forbidden_not_owner", { username }),
    });
  }

  const isMatch = await bcrypt.compare(currentPassword, linkedUser.password);
  if (!isMatch) {
    return res.status(400).json({
      state: "error",
      message: res.__("incorrect_current_password"),
    });
  } else {
    return res.status(200).json({
      state: "success",
      message: res.__("success_password_confirmed", {
        username: linkedUser.username,
      }),
    });
  }
});
