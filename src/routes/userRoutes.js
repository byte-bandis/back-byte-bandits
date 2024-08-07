const router = require("express").Router();

const {
  register,
  login,
  getUsersPublicProfiles,
} = require("../controller/UserController");

router.post("/register", register);
router.post("/login", login);
router.get("/usersprofiles", getUsersPublicProfiles);

module.exports = router;
