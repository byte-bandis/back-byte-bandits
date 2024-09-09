const router = require("express").Router();
const {
  sendEmail,
  resetPassword,
} = require("../controller/NodemailerController");

router.post("/", sendEmail);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
