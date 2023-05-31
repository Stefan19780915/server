const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  storeName: {
    type: String,
  },
  storeStreet: {
    type: String,
  },
  storeStreetNumber: {
    type: String,
  },
  storeCity: {
    type: String,
  },
  storeRGM: {
    type: String,
  },
});

module.exports = mongoose.model("Store", storeSchema);
