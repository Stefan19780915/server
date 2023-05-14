// CREATE NEW EMPLOYEE DROP DOWN
const newEmploye = document.querySelector(".new-employee");
const employeeForm = document.querySelector(".employee-form");
newEmploye.addEventListener("click", (e) => {
  employeeForm.style.maxHeight == "0px"
    ? (employeeForm.style.maxHeight = "1500px")
    : (employeeForm.style.maxHeight = "0px");
});
