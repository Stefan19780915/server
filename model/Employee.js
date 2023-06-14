const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const childSchema = new Schema({
  childName: {
    type: String,
  },
  childSurname: {
    type: String,
  },
  childDateOfBirth: {
    type: Date,
  },
  childSocialSecNumber: {
    type: Number,
  },
});

const employeesSchema = new Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  },
  employeeState: {
    type: Boolean,
    default: true,
  },
  personalNumber: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  birthPlace: {
    type: String,
  },
  socialSecNumber: {
    type: Number,
  },
  idCardNumber: {
    type: String,
  },
  country: {
    type: String,
  },
  nationality: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  landLinePhone: {
    type: String,
  },
  mobilePhone: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  street: {
    type: String,
  },
  houseNumber: {
    type: Number,
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,
  },

  children: [childSchema],

  spouseName: {
    type: String,
  },
  spouseSurname: {
    type: String,
  },
  spouseDateOfBirth: {
    type: Date,
  },
  spouseSocialSecNumber: {
    type: Number,
  },
  publicHealthInsuranceName: {
    type: String,
  },
  gastroHealthCard: {
    type: String,
  },
  bankName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  bankCode: {
    type: Number,
  },
  contractStartDate: {
    type: Date,
  },
  contractEndDate: {
    type: String,
  },
  contractSalaryType: {
    type: String,
  },
  contractSalary: {
    type: mongoose.Decimal128,
  },
  contractType: {
    type: String,
  },
  contractWeeklyHours: {
    type: mongoose.Decimal128,
  },
});

module.exports = mongoose.model("Employee", employeesSchema);
