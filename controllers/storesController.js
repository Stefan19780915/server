const Store = require("../model/Store");
const Employee = require("../model/Employee");

const createStore = async (req, res) => {
  console.log(req.body);
  const newStore = {
    admin: req.body.admin,
    user: req.body.user,
    storeName: req.body.storeName,
    storeEmail: req.body.storeEmail,
    storeStreet: req.body.storeStreet,
    storeStreetNumber: req.body.storeStreetNumber,
    storeCity: req.body.storeCity,
    storeRGM: req.body.storeRGM,
  };

  if (newStore.user == 0) {
    req.flash("message", "Please select a store user.");
    return res.redirect("/employee");
  }

  if (
    !newStore.admin ||
    !newStore.user ||
    !newStore.storeName ||
    !newStore.storeEmail ||
    !newStore.storeStreet ||
    !newStore.storeStreetNumber ||
    !newStore.storeCity ||
    !newStore.storeRGM
  ) {
    req.flash("message", "All fields are required.");
    res.redirect("/employee");
  }

  try {
    const result = await Store.create(newStore);
    req.flash(
      "message",
      `Store ${result.storeName} for RGM: ${result.storeRGM} was created successfully.`
    );
    res.redirect("/employee");
  } catch (err) {
    console.log(err);
  }
};

const updateStore = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Id is required.");
    return res.redirect("/pages/404");
  }

  console.log(req.body);
  const store = await Store.findOne({ _id: req.params.id }).exec();

  if (!store) {
    req.flash("message", "Store not found.");
    return req.redirect("/pages/404");
  }

  if (req.body.user != 0) {
    store.user = req.body.user;
  } else {
    store.user;
  }

  if (req.body.storeName) store.storeName = req.body.storeName;
  if (req.body.storeEmail) store.storeEmail = req.body.storeEmail;
  if (req.body.storeStreet) store.storeStreet = req.body.storeStreet;
  if (req.body.storeStreetNumber)
    store.storeStreetNumber = req.body.storeStreetNumber;
  if (req.body.storeCity) store.storeCity = req.body.storeCity;
  if (req.body.storeRGM) store.storeRGM = req.body.storeRGM;

  const result = await store.save();

  if (result != undefined) {
    req.flash("message", `Store ${store.storeName} was updated.`);
    res.redirect("/employee");
  } else {
    req.flash("message", `Store ${store.storeName} was not updated.`);
    res.redirect("/pages/404");
  }
};

const deleteStore = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Please provide correct ID");
    return res.redirect("pages/404");
  }
  const store = await Store.findOne({ _id: req.params.id });

  const employees = await Employee.find({ store: store._id });

  if (employees.length > 0) {
    req.flash(
      "message",
      `The store ${store.storeName} cannot be deleted because there are employees assiciated with it.`
    );
    return res.redirect("/employee");
  }

  const result = await store.deleteOne({ _id: req.params.id });
  req.flash("message", `Store ${result.storeName} was deleted.`);
  res.redirect("/employee");
};

module.exports = {
  createStore,
  deleteStore,
  updateStore,
};
