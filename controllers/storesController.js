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

  console.log(newStore);

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

const deleteStore = async (req, res) => {};

const updateStore = async (req, res) => {};

module.exports = {
  createStore,
  deleteStore,
  updateStore,
};
