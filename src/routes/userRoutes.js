const router = require("express").Router();
const { authenticate } = require("../middleware/auth");

const {
  register,
  login,
  getUsersPublicProfiles,
  getMyProfile,
  getMyPublicProfile,
  createPublicProfile,
} = require("../controller/UserController");

router.post("/register", register);
router.post("/login", login);
router.get("/usersprofiles", getUsersPublicProfiles);
router.get("/:username", authenticate, getMyPublicProfile);
router.post("/:username", createPublicProfile);

module.exports = router;
