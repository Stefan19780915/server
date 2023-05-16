// CREATE NEW EMPLOYEE DROP DOWN
const dropDowns = document.querySelectorAll(".new-employee");

dropDowns.forEach((dropDown) => {
  dropDown.addEventListener("click", (e) => {
    console.log(e.currentTarget.nextElementSibling.style.maxHeight);
    e.currentTarget.nextElementSibling.style.maxHeight == "0px"
      ? (e.currentTarget.nextElementSibling.style.maxHeight = "1500px")
      : (e.currentTarget.nextElementSibling.style.maxHeight = "0px");
  });
});

const allNames = document.querySelectorAll(".name");
allNames.forEach((item) => {
  item.addEventListener("click", (e) => {
    //e.currentTarget.nextElementSibling.classList.toggle("d-flex-visible");
    e.currentTarget.nextElementSibling.style.height === "60px"
      ? (e.currentTarget.nextElementSibling.style.height = "0px")
      : (e.currentTarget.nextElementSibling.style.height = "60px");
    Array.from(
      e.currentTarget.parentElement.parentElement.parentElement.children
    )
      .filter((tab) => tab.classList.contains("tab"))
      .forEach((item) => {
        item.style.maxHeight = "0px";
      });
    Array.from(e.currentTarget.nextElementSibling.children).forEach((item) => {
      item.classList.remove("selected");
    });
  });
});

//SUB CAT
const allSubCat = document.querySelectorAll(".sub-cat");
allSubCat.forEach((item) => {
  item.addEventListener("click", (e) => {
    allSubCat.forEach((item) => {
      item == e.currentTarget
        ? e.currentTarget.nextElementSibling.style.maxHeight === "1500px"
          ? (e.currentTarget.nextElementSibling.style.maxHeight = "0px")
          : (e.currentTarget.nextElementSibling.style.maxHeight = "1500px")
        : (item.nextElementSibling.style.maxHeight = "0px");
    });
  });
});

const toggleVisibility = (e, trigClass, tarClass) => {
  e.target.classList.contains(trigClass)
    ? Array.from(
        e.currentTarget.parentElement.parentElement.parentElement.children
      )
        .filter((tab) => tab.classList.contains("tab"))
        .forEach((item) => {
          //console.log(item);
          item.classList.contains(tarClass)
            ? item.style.maxHeight === "1500px"
              ? (item.style.maxHeight = "0px")
              : (item.style.maxHeight = "1500px")
            : (item.style.maxHeight = "0px");
        })
    : "";
};

//Selected ICONS
const toggleSelected = (e, trigClass, tarClass) => {
  e.target.classList.contains(trigClass)
    ? Array.from(e.target.parentElement.children).forEach((item) => {
        item.classList.contains(trigClass)
          ? item.classList.toggle("selected")
          : item.classList.remove("selected");
      })
    : "";
};

const iconBars = document.querySelectorAll(".icon-bar");
iconBars.forEach((bar) => {
  bar.addEventListener("click", (e) => {
    toggleVisibility(e, "profile", "profile-tab");
    toggleVisibility(e, "contacts", "contact-tab");
    toggleVisibility(e, "calendar", "calendar-tab");
    toggleVisibility(e, "settings", "settings-tab");
    toggleSelected(e, "profile", "profile-tab");
    toggleSelected(e, "contacts", "contact-tab");
    toggleSelected(e, "calendar", "calendar-tab");
    toggleSelected(e, "settings", "settings-tab");
  });
});
