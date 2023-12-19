const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  companyName: {
    type: String,
  },
  companyStreet: {
    type: String,
  },
  companyStreetNumber: {
    type: String,
  },
  companyCity: {
    type: String,
  },
  companyCountry: {
    type: String,
  },
  companyBusinessRegister: {
    type: String,
  },
  companyTaxId: {
    type: String,
  },

});

module.exports = mongoose.model("Company", companySchema);