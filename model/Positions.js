const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const positionSchema = new Schema({
  storeCompany: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  position: {
    type: String,
  }
});

module.exports = mongoose.model("Position", positionSchema);