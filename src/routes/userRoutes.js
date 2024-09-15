const router = require("express").Router();
const upload = require("../utils/publicUploadConfigure");
const { authenticate } = require("../middleware/auth");

const {
  register,
  login,
  getUsersPublicProfiles,
  getUser,
} = require("../controller/UserController");

const {
  getSinglePublicProfile,
  createPublicProfile,
  updatePublicProfile,
} = require("../controller/PublicProfileController");

const {
  getMyAddress,
  createMyAddress,
  updateMyAddress,
  deleteMyAddress,
} = require("../controller/myPersonalData/MyAddressController");

const {
  createMyCreditCard,
  getMyCreditCard,
  deleteMyCreditCard,
  updateMyCreditCard,
} = require("../controller/myPersonalData/MyCreditCardController");
const {
  getMyData,
  updateMyData,
} = require("../controller/myPersonalData/MyDataController");
const {
  updateMyPassword,
  matchMyPassword,
} = require("../controller/myPersonalData/passwordController");
const { deleteUser } = require("../controller/DeleteUserController");

router.post("/register", register);
router.post("/login", login);
router.get("/find/:userId", getUser);

router.get("/usersprofiles", getUsersPublicProfiles);

router.get("/:username/myaddress", authenticate, getMyAddress);
router.post("/:username/myaddress", authenticate, createMyAddress);
router.put("/:username/myaddress", authenticate, updateMyAddress);
router.delete("/:username/myaddress", authenticate, deleteMyAddress);

router.post("/:username/mycreditcard", authenticate, createMyCreditCard);
router.get("/:username/mycreditcard", authenticate, getMyCreditCard);
router.put("/:username/mycreditcard", authenticate, updateMyCreditCard);
router.delete("/:username/mycreditcard", authenticate, deleteMyCreditCard);

router.get("/:username/mydata", authenticate, getMyData);
router.put("/:username/mydata", authenticate, updateMyData);

router.put("/:username/password", authenticate, updateMyPassword);
router.post("/:username/confirm-password", authenticate, matchMyPassword);

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

router.delete("/:username", authenticate, deleteUser);

module.exports = router;
