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
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  birthPlace: {
    type: String,
    required: true,
  },
  socialSecNumber: {
    type: Number,
    required: true,
  },
  idCardNumber: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  maritalStatus: {
    type: String,
    required: true,
  },
  landLinePhone: {
    type: String,
  },
  mobilePhone: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
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
    type: Date,
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
