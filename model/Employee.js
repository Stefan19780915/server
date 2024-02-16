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
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Position",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  birthName: {
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
    type: String,
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  streetTemp: {
    type: String,
  },
  houseNumberTemp: {
    type: String,
  },
  cityTemp: {
    type: String,
  },
  postalCodeTemp: {
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
  ztpDochodca: {
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
  schoolName: {
    type: String,
  },
  employerName: {
    type: String,
  },
  contractStartDate: {
    type: Date,
  },
  taxStartDate: {
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
  studentCompensation: {
    type: Boolean,
    default: false,
  },
  compensationDateStart: {
    type: Date,
  },
});

module.exports = mongoose.model("Employee", employeesSchema);
