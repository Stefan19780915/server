const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    required: true,
  },
  password: {
    type: String,
    required: true,
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
