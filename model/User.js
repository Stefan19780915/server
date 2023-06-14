const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
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
});

module.exports = mongoose.model("User", userSchema);
