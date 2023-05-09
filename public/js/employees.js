// CREATE NEW EMPLOYEE DROP DOWN
const newEmploye = document.querySelector(".new-employee");
const employeeForm = document.querySelector(".employee-form");
console.log(newEmploye, employeeForm);
newEmploye.addEventListener("click", (e) => {
  employeeForm.style.maxHeight == "0px"
    ? (employeeForm.style.maxHeight = "1000px")
    : (employeeForm.style.maxHeight = "0px");
});
