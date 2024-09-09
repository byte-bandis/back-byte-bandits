const router = require("express").Router();

const { tryCatch } = require("../utils/tryCatch");
import { __ } from "i18n";
import User from "../models/User";

router.post(
  "/",
  sendEmail
  /*   tryCatch(async (req, res) => {
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
        subject = __("Welcome_to_the_platform") + " " + userName;
        break;

      case "resetPassword":
        if (!email) {
          return res.status(400).json({
            state: "error",
            message: __("Please_enter_a_valid_email"),
          });
        }

        const checkUserName = await User.findOne({ username: userName });
        const checkUserEmail = await User.findOne({ email });

        console.log("esto es email: ", checkUserEmail);
        console.log("esto es user: ", checkUserName);

        if (!checkUserName) {
          return res.status(404).json({
            state: "error",
            message: __("user_not_linked_to_any_account", { userName }),
          });
        }
        if (!checkUserEmail) {
          return res.status(404).json({
            state: "error",
            message: __("email_not_found", { email }),
          });
        }

        const user = await User.findOne({ email, username: userName });

        if (!user) {
          return res.status(404).json({
            state: "error",
            message: __("username_email_dont_match", { userName, email }),
          });
        }

        const token = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const resetLink = `${hostURI}/reset-password/${token}`;
        subject = __("Reset_your_password") + " " + userName;
        html = resetPasswordTemplate(userName, resetLink, res);
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
    console.log("sendedMail", sendedMail);

    if (!sendedMail) {
      return res.status(500).json({ message: res.__("Email_not_sent") });
    }
    res.status(200).json({ message: res.__("Email_sent_successfully") });
  }) */
);

module.exports = router;
