const User = require("../model/User");
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

// REGISTER USER AND REDIRECT TO EMPLOYEE ROUTE
const registerUser = async (req, res) => {
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
    res.redirect("/login");
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

module.exports = {
  register,
  login,
  registerUser,
  getUserByEmail,
  getUserById,
  updateUser,
};
