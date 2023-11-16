const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const positionSchema = new Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  position: {
    type: String,
  }
});

module.exports = mongoose.model("Position", positionSchema);