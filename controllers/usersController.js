const Store = require("../model/Store");
const User = require("../model/User");
const Token = require("../model/token");
const bcrypt = require("bcrypt");

//RENDER READ REGISTER PAGE
const register = async (req, res) => {
  res.render("../views/pages/register", {
    msg: false,
    user: "",
    message: req.flash("message"),
  });
};

//RENDER READ LOGIN PAGE
const login = async (req, res) => {
  res.render("../views/pages/login", {
    msg: false,
    user: "",
    message: req.flash("message"),
  });
};

//READ USER BY EMAIL
const getUserByEmail = async (email) => {
  const result = await User.findOne({ userEmail: email });
  return result;
};

//READ USER BY ID
const getUserById = async (id) => {
  const result = await User.findOne({ _id: id });
  return result;
};

// USER EMAIL VERYFICATION

const verifyUserEmail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      req.flash("message", "Invalid link.");
      return res.redirect("/");
    }
    const token = await Token.findOne({
      userID: user.id,
      token: req.params.token,
    });
    if (!token) {
      req.flash("message", "Invalid link.");
      return res.redirect("/");
    }

    await User.updateOne({ _id: user.id, verified: true, active: true });
    await Token.findByIdAndRemove(token._id);

    req.flash("message", "Email was verified successfully.");
    res.redirect("/");
  } catch (err) {
    req.flash("message", "An error occured.");
    res.redirect("/");
    console.log(err);
  }
};

// REGISTER USER AND REDIRECT TO EMPLOYEE ROUTE
const registerUser = async (req, res) => {
  const duplicateUser = await User.findOne({ userEmail: req.body.userEmail });

  if (duplicateUser) {
    req.flash("message", "User already exists with provided email.");
    return res.redirect("/register");
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      password: hashedPassword,
    };
    const result = await User.create(newUser);
    req.flash(
      "message",
      `Account with name ${result.userName} has been created.`
    );
    res.redirect("/");
  } catch (err) {
    req.flash("message");
    res.redirect("/register");
    console.log(err);
  }
};

// UPDATE USER AND REDIRECT TO EMPLOYEE ROUTE
const updateUser = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Please provide correct ID");
    return res.redirect("pages/404");
  }

  const user = await User.findOne({ _id: req.params.id }).exec();

  if (!req.body.active) {
    user.active = false;
  } else {
    user.active = true;
  }

  if (req.body.userName) user.userName = req.body.userName;
  if (req.body.userEmail) user.userEmail = req.body.userEmail;
  if (req.body.roles) user.roles = req.body.roles;

  const resultUser = await user.save();

  if (resultUser != undefined) {
    req.flash("message", `User ${resultUser.userName} was updated.`);
    res.redirect("/employee");
  } else {
    req.flash("message", "User was not updated.");
    res.redirect("pages/404");
  }
};

const deleteUser = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Please provide correct ID");
    return res.redirect("pages/404");
  }
  const user = await User.findOne({ _id: req.params.id }).exec();

  const store = await Store.findOne({ user: req.params.id });

  if (store) {
    req.flash(
      "message",
      `User ${user.userName} cannot be deleted bacause it is assigned to store ${store.storeName}.`
    );
    return res.redirect("/employee");
  }

  const users = await User.find({ roles: "Admin" });

  if (users.length < 2 && user.roles == "Admin") {
    req.flash(
      "message",
      `The user ${user.userName} cannot be deleted because the user is the only Administrator. Please assign another users Admin rights as well.`
    );
    return res.redirect("/employee");
  }

  if (!user) {
    req.flash("message", "Please provide the correct ID.");
    return res.redirect("/pages/404");
  }
  const result = await user.deleteOne({ _id: req.params.id });
  req.flash("message", `Personal data of ${result.userName} was deleted.`);
  res.redirect("/employee");
};

module.exports = {
  register,
  login,
  registerUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  verifyUserEmail,
};
