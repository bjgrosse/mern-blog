const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller");

router
  .route("/users/current")
  .get(
    passport.authenticate("jwt", { session: false }),
    UserController.getUserProfile
  );
router
  .route("/users/update")
  .post(
    passport.authenticate("jwt", { session: false }),
    UserController.updateUserProfile
  );
router.route("/users/register").post(UserController.registerUser);
router.route("/users/checkEmail").post(UserController.checkEmail);
router.route("/users/login").post(UserController.login);
module.exports = router;
