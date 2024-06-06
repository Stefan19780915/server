const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
  position: {
    type: mongoose.Schema.Types.ObjectId,
        ref: "Position",
      },
  store: {
    type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
  contractState: {
      type: Boolean,
      default: true,
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
  studentCompensation: {
    type: Boolean,
    default: false,
      },
  compensationDateStart: {
    type: Date,
      },        
});

module.exports = mongoose.model("Contract", contractSchema);