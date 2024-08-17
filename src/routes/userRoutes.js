const router = require("express").Router();
const upload = require("../utils/publicUploadConfigure");
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
router.get("/:username", getSinglePublicProfile);
router.post(
  "/:username",
  authenticate,
  upload.fields([
    { name: "userPhoto", maxCount: 1 },
    { name: "headerPhoto", maxCount: 1 },
  ]),
  createPublicProfile
);
router.put(
  "/:username",
  authenticate,
  upload.fields([
    { name: "userPhoto", maxCount: 1 },
    { name: "headerPhoto", maxCount: 1 },
  ]),
  updatePublicProfile
);
router.delete("/:username", authenticate, deletePublicProfile);

module.exports = router;
