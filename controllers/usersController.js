const { verify } = require("crypto");
const Store = require("../model/Store");
const User = require("../model/User");
const Employee = require("../model/Employee");
const Token = require("../model/token");
const bcrypt = require("bcrypt");
const Company = require("../model/Company");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmployeeEmail");
const token = require("../model/token");

//RENDER READ REGISTER PAGE
const register = async (req, res) => {
  res.render("../views/pages/register", {
    msg: false,
    user: "",
    message: req.flash("message"),
  });
};

//RENDER FORGOT MY PASSWORD PAGE
const forgotPass = async (req, res)=>{
  res.render("../views/pages/forgotpass", {
    msg: false,
    user: '',
    message: req.flash('message'),
  });
};

//RENDER RESET PASSWORD PAGE

const resetPassPage = async (req, res)=>{

  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      req.flash("message", "Invalid link - user.");
      return res.redirect("/");
    }
    const token = await Token.findOne({
      userID: user.id,
      token: req.params.token,
    });
    
    if (!token) {
      req.flash("message", "Invalid link - token.");
      return res.redirect("/");
    }

   //console.log(user.id);

    res.render("../views/pages/resetpass", {
      msg: false,
      user: '',
      id: user.id,
      token: req.params.token,
      link: '',
      message: req.flash('message','Link has been sent to youe email.'),
    });


  } catch (err) {
    req.flash("message", "An error occured.");
    res.redirect("/");
    console.log(err);
  }
  
}

// RESET PASS

const resetPass = async (req, res)=>{

  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    req.flash("message", "No user found.");
    return 
  }
  if(req.body.password != req.body.passwordConfirm){
      return res.render("../views/pages/resetpass", {
      msg: false,
      id: user.id,
      token: req.body.token,
      user: '',
      link: `/reset/${user.id}/${req.params.token}`,
      message: 'The passwords do not match'
    });
  } else {
    try{
      console.log(req.body.password, req.body.passwordConfirm, req.params.id, req.params.token );
      if(req.body.password){
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword

        const result = await user.save();

        if(result){
          req.flash("message", `Your password has been reset.`);
          res.redirect("/");
        }
      }
    } catch (err){
      console.log(err);
    }

  }
}

//RENDER READ LOGIN PAGE
const login = async (req, res) => {
  res.render("../views/pages/login", {
    msg: false,
    link: '',
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

//RESET PASS LINK

const resetPassLink = async (req, res)=>{
  
  const user = await User.findOne({ userEmail: req.body.userEmail });

  if(!user){
  req.flash("message", `No user found with following email: ${req.body.userEmail}.`);
    return res.redirect("/");
  }


try {

  // CREATE THE TOKEN HERE
  const token = {
    userID: user.id,
    token: crypto.randomBytes(32).toString("hex"),
  };

  const resultToken = await Token.create(token);

  //SEND THE EMAIL VERIFICATION LINK
  process.env.BASE_URL

  const link = `${process.env.BASE_URL}/reset/${user.id}/${resultToken.token}`;

  const html = `
  <h1>Hello</h1>
    <p>Please click on the link below, to reset your password.</p>
    <a href="${link}">${link}</a>`;

  const info = await sendEmail(
    user.userEmail,
    [],
    "Please reset your password",
    html
  );

  
  return res.render("../views/pages/login",{
    msg: false,
    user: '',
    link: '/employee',
    message: `Password reset link has been sent to ${user.userEmail}.`
  });

} catch (err){
  console.log(err);
}

}


// USER EMAIL VERYFICATION

const verifyUserEmail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      req.flash("message", "Invalid link - user.");
      return res.redirect("/");
    }
    const token = await Token.findOne({
      userID: user.id,
      token: req.params.token,
    });

    if (!token) {
      req.flash("message", "Invalid link - token.");
      return res.redirect("/");
    }

    await User.updateOne({ _id: user._id }, { verified: true });
    await User.updateOne({ _id: user._id }, { active: true });
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

  //const company = req.body.storeCompany != '0' ? await Company.findOne({ _id: req.body.storeCompany }).exec() : 0;

  const user = await User.findOne({ _id: req.params.id }).exec();

  if (!req.body.active) {
    user.active = false;
  } else {
    user.active = true;
  }

  if (req.body.userName) user.userName = req.body.userName;
  if (req.body.userEmail) user.userEmail = req.body.userEmail;
  if (req.body.roles != '0' && req.body.roles) user.roles = req.body.roles;
  if (req.body.storeCompany != '0' && req.body.storeCompany) user.storeCompany = req.body.storeCompany ;

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


  const employee = await Employee.findOne({ user: req.params.id });

  if (employee) {
    req.flash(
      "message",
      `User ${user.userName} cannot be deleted bacause it is assigned to Employee ${employee.firstName} ${employee.lastName}.`
    );
    return res.redirect("/employee");
  }

// Check if there is a user of the store assigned
  const storeManager = await Store.findOne({ user: req.params.id });
  if (storeManager) {
    req.flash(
      "message",
      `User ${user.userName} cannot be deleted bacause it is assigned to store ${storeManager.storeName}.`
    );
    return res.redirect("/employee");
  }

  // Check if there is one more Super User
  const users = await User.find({ roles: "Super" });
  if (users.length < 2 && user.roles == "Super") {
    req.flash(
      "message",
      `The user ${user.userName} cannot be deleted because the user is the only Super Administrator. Please assign another users Super rights as well.`
    );
    return res.redirect("/employee");
  }
  
  //Check if the user is assigned as Area Coach of the store
const storeAdmin = await Store.findOne({ admin: req.params.id });
if (storeAdmin) {
  req.flash(
    "message",
    `User ${user.userName} cannot be deleted bacause it is assigned as Area Coach to store ${storeAdmin.storeName}.`
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
  forgotPass,
  resetPassLink,
  resetPassPage,
  resetPass
};
