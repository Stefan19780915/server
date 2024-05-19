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
        ? e.currentTarget.nextElementSibling.style.maxHeight === "1800px"
          ? (e.currentTarget.nextElementSibling.style.maxHeight = "0px")
          : (e.currentTarget.nextElementSibling.style.maxHeight = "1800px")
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
          item.classList.contains(tarClass)
            ? item.style.maxHeight === "1800px"
              ? (item.style.maxHeight = "0px")
              : (item.style.maxHeight = "1800px")
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

//CUSTOM SELECT

var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      /* When an item is clicked, update the original select box,
        and the selected item: */
      var y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function (e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x,
    y,
    i,
    xl,
    yl,
    arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

//Fertch Nationality API
//Elements - API box must be the next element sibling of the search input field
const nationalityInput = document.getElementById('nationalityInput')
const nationalityBox = document.getElementById('nationalityBox');
const loadNationalityApi = () => {
  fetch('https://restcountries.com/v3.1/all?fields=demonyms')
  .then( res => res.json())
  .then(data => {
    const nat = data.map(item=> {return {name: {common: item.demonyms.eng.m}}});
    displayApiData(nat, 'name', 'common', nationalityInput, nationalityBox);
  });
}

//Fetch Countries API
//Elements - API box must be the next element sibling of the search input field
const countryInput = document.getElementById('countryInput')
const countryBox = document.getElementById('countryBox');
const loadCountryApi = () => {
  fetch('https://restcountries.com/v3.1/all')
  .then( res => res.json())
  .then(data => {
    displayApiData(data, 'name', 'common', countryInput, countryBox);
  });
}

//Displazing the API DATAS
const updateInput = (e)=>{
  console.log(e.firstChild.textContent);
  e.parentElement.previousElementSibling.value = '';
  e.parentElement.previousElementSibling.value = e.firstChild.textContent;
  e.parentElement.innerHTML = '';
}

const displayApiData = (data, name, common, input, box) =>{
  input.addEventListener('keyup', (e)=>{
    let matches = data.filter( item =>{
      let itemChar = item[name][common].slice(0, e.target.value.length);
      return itemChar.toUpperCase() == e.target.value.toUpperCase();
    })
    const HTML = matches.map(country => getCountry(country,name,common));
    box.innerHTML = HTML.join('');
  })
}

const getCountry = (country, name, common) =>{
  return `<h4 class="sub-cat" onclick="updateInput(this)"><a style="margin-left:20px">${country[name][common]}</a></h4>`
}

//CALLING APIS
loadCountryApi();
loadNationalityApi();

