const User = require("../model/User");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  res.render("../views/pages/register", {
    msg: false,
    user: "",
  });
};

const login = async (req, res) => {
  res.render("../views/pages/login", {
    msg: false,
    user: "",
  });
};

const getUserByEmail = async (email) => {
  const result = await User.findOne({ userEmail: email });
  return result;
};

const getUserById = async (id) => {
  const result = await User.findOne({ _id: id });
  return result;
};

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      password: hashedPassword,
    };
    const result = await User.create(newUser);
    console.log(result);
    res.render("../views/pages/login", {
      msg: false,
      user: "",
    });
  } catch (err) {
    res.redirect("/register");
    console.log(err);
  }
};

module.exports = {
  register,
  login,
  registerUser,
  getUserByEmail,
  getUserById,
};
