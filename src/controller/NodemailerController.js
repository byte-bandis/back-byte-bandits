const bcrypt = require("bcryptjs");
const User = require("../models/User");
//const { __ } = require("i18n");
const { tryCatch } = require("../utils/tryCatch");
const crypto = require("crypto");
const { transporter } = require("../utils/nodeMailer");
const {
  welcomeTemplate,
  resetPasswordTemplate,
} = require("../utils/mainTemplates");

exports.sendEmail = tryCatch(async (req, res) => {
  const { email, userName, type } = req.body;
  let html;
  let subject;

  const hostURI =
    process.env.NODE_ENV !== "production"
      ? `${process.env.DEV_HOST_URI}`
      : `${process.env.HOST_URI}`;

  switch (type) {
    case "welcome":
      html = welcomeTemplate(userName);
      subject = res.__("Welcome_to_the_platform") + " " + userName;
      break;

    case "resetPassword":
      if (!email) {
        return res.status(400).json({
          state: "error",
          message: res.__("Please_enter_a_valid_email"),
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          state: "error",
          message: res.__("email_not_found", { email }),
        });
      }

      const token = crypto.randomBytes(20).toString("hex");

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();

      const resetLink = `${hostURI}/reset-password/${token}`;
      subject = res.__("Reset_your_password") + " " + user.username;
      html = resetPasswordTemplate(user.username, resetLink, res);
      break;

    default:
      return res.status(400).json({ message: res.__("Invalid_email_type") });
  }

  const sendedMail = await transporter.sendMail({
    from: "ICraftYouMaster@gmail.com",
    to: email,
    subject: subject,
    html: html,
  });

  if (!sendedMail) {
    return res.status(500).json({ message: res.__("Email_not_sent") });
  }
  res.status(200).json({
    state: "success",
    message: res.__("Email_sent_successfully"),
  });
});

exports.resetPassword = tryCatch(async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      state: "error",
      message: res.__("wrong_password_length"),
    });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      state: "error",
      message: res.__("invalid_token"),
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      state: "error",
      message: res.__("passwords_dont_match"),
    });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({
    state: "success",
    message: res.__("password_has_been_reset"),
  });
});
