const User = require("../model/User");
const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");

async function createUser(req, res, next) {
  const employee = await Employee.findOne({ _id: req.params.id })
    .populate("store")
    .exec();

  const user = await User.findOne({ userEmail: req.body.email });

  if (!user) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = {
        store: employee.store.id,
        userName: `${employee.firstName} ${employee.lastName}`,
        userEmail: req.body.email,
        password: hashedPassword,
      };
      const result = await User.create(newUser);
      next();
    } catch (err) {
      req.flash("message");
      res.redirect("/employee");
      console.log(err);
    }
  } else {
    next();
  }
}

module.exports = { createUser };
