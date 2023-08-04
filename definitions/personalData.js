const Employee = require("../model/Employee");

async function personalData(req, res) {
  const oneEmployee = await Employee.findOne({ _id: req.params.id }).populate(
    "store"
  );
  const definition = {
    content: [
      "This will be the personal data Doc Definition",
      `Name: ${oneEmployee.firstName}`,
    ],
    pdf: `${oneEmployee.lastName} ${oneEmployee.firstName} personal data.pdf`,
  };

  const options = {};

  return definition;
}

module.exports = {
  personalData,
};
