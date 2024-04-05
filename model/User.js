const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  storeCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
  },
  password: {
    type: String,
  },
  roles: {
    type: String,
    default: "User",
  },
  active: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
