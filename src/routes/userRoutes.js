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
const {
  getMyAddress,
  createMyAddress,
  updateMyAddress,
  deleteMyAddress,
} = require("../controller/myPersonalData/MyAddressController");

router.post("/register", register);
router.post("/login", login);
router.get("/usersprofiles", getUsersPublicProfiles);
router.get("/:username/myaddress", authenticate, getMyAddress);
router.post("/:username/myaddress", authenticate, createMyAddress);
router.put("/:username/myaddress", authenticate, updateMyAddress);
router.delete("/:username/myaddress", authenticate, deleteMyAddress);
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
