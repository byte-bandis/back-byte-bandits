const router = require("express").Router();
const { authenticate } = require("../middleware/auth");

const {
  register,
  login,
  getUsersPublicProfiles,
  getMyAccount,
} = require("../controller/UserController");

const {
  getSinglePublicProfile,
  createPublicProfile,
  updatePublicProfile,
  deletePublicProfile,
} = require("../controller/PublicProfileController");

router.post("/register", register);
router.post("/login", login);
router.get("/usersprofiles", getUsersPublicProfiles);
router.get("/:username/myaccount", authenticate, getMyAccount);
router.get("/:username", authenticate, getSinglePublicProfile);
router.post("/:username", authenticate, createPublicProfile);
router.put("/:username", authenticate, updatePublicProfile);
router.delete("/:username", authenticate, deletePublicProfile);

module.exports = router;
