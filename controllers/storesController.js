const Store = require("../model/Store");

const createStore = async (req, res) => {
  console.log(req.body);
  const newStore = {
    user: req.body.user,
    storeName: req.body.storeName,
    storeStreet: req.body.storeStreet,
    storeStreetNumber: req.body.storeStreetNumber,
    storeCity: req.body.storeCity,
    storeRGM: req.body.storeRGM,
  };

  if (
    !newStore.user ||
    !newStore.storeName ||
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

  const store = await Store.findOne({ _id: req.params.id }).exec();

  if (!store) {
    req.flash("message", "Store not found.");
    return req.redirect("/pages/404");
  }

  if (req.body.user) store.user = req.body.user;
  if (req.body.storeName) store.storeName = req.body.storeName;
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

const deleteStore = async (req, res) => {};

module.exports = {
  createStore,
  deleteStore,
  updateStore,
};
