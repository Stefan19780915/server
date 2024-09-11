const Store = require("../model/Store");

async function swapStore (req,res,next) {
    //console.log(req.body.storeState);
    const store = await Store.findOne({ _id: req.body.storeState});
   // console.log(store._id);
   // console.log(req.user);
   if(req.body.storeState){
        req.user.store = store;
   }
    next();
} 

module.exports = {
    swapStore
}