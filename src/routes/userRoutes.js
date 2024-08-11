const router = require("express").Router();
const { authenticate } = require("../middleware/auth");

const {
  register,
  login,
  getUsersPublicProfiles,
  getMyProfile,
  getMyPublicProfile,
} = require("../controller/UserController");

router.post("/register", register);
router.post("/login", login);
router.get("/usersprofiles", getUsersPublicProfiles);
router.get("/:username", authenticate, getMyPublicProfile);

module.exports = router;
