const currentDate = new Date();

//Haldle Contract End Date
document.getElementById("check").addEventListener("change", (e) => {
  //console.log(e.target.value);
  if (e.target.value == 1) {
    document.getElementById("hidden").disabled = false;
    document.getElementById("hidden").value = "indefinite";
    document.getElementById("endDate").disabled = true;
    e.target.value = 0;
  } else {
    e.target.value = 1;
    document.getElementById("endDate").disabled = false;
    document.getElementById("hidden").disabled = true;
  }
});

//Handle Helath Card End Date

document.getElementById("checkHealth").addEventListener("change", (e) => {
  //console.log(e.target.value);
  if (e.target.value == 1) {
    document.getElementById("hiddenHealth").disabled = false;
    document.getElementById("hiddenHealth").value = "indefinite";
    document.getElementById("cardEndDate").disabled = true;
    e.target.value = 0;
  } else {
    e.target.value = 1;
    document.getElementById("cardEndDate").disabled = false;
    document.getElementById("hiddenHealth").disabled = true;
  }
});

//console.log(currentDate.getDay());

const allNames = document.querySelectorAll(".name");
allNames.forEach((item) => {
  item.addEventListener("click", (e) => {
    //e.currentTarget.nextElementSibling.classList.toggle("d-flex-visible");
    e.currentTarget.nextElementSibling.style.maxHeight === "600px"
      ? (e.currentTarget.nextElementSibling.style.maxHeight = "0px")
      : (e.currentTarget.nextElementSibling.style.maxHeight = "600px");
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

// Jquery Dependency - format surrency

$("input[data-type='currency']").on({
  keyup: function () {
    formatCurrency($(this));
  },
  blur: function () {
    formatCurrency($(this), "blur");
  },
});

function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.

  // get input value
  var input_val = input.val();

  // don't validate empty input
  if (input_val === "") {
    return;
  }

  // original length
  var original_len = input_val.length;

  // initial caret position
  var caret_pos = input.prop("selectionStart");

  // check for decimal
  if (input_val.indexOf(".") >= 0) {
    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);

    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = "Є" + left_side + "." + right_side;
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = "Є" + input_val;

    // final formatting
    if (blur === "blur") {
      input_val += ".00";
    }
  }

  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}
