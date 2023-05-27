const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const {
  checkNotAuthUser,
  checkAuthUser,
  checkAdmin,
} = require("../middleware/authHandler");
const passport = require("passport");
const initializePassport = require("../config/passportConfig");

initializePassport(
  passport,
  usersController.getUserByEmail,
  usersController.getUserById
);

router.get("/register", checkNotAuthUser, usersController.register);

router.get("/", checkNotAuthUser, usersController.login);

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/employee",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.delete("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post("/register", usersController.registerUser);

router.put("/user/:id", checkAuthUser, checkAdmin, usersController.updateUser);

router.get("/user/:id", checkAuthUser, checkAdmin, usersController.deleteUser);

module.exports = router;
