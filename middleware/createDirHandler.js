const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");
const Contract = require('../model/Contract');
const moment = require("moment");
moment.locale("sk");
    
async function createDir (req, res, next){

        const data = await Employee.findOne({ _id: req.params.id }).populate(
            "store"
          ).populate("position");

          const contract = await Contract.findOne({ employee: data._id });
    
        // Multilevel directory 
const dirPath = `./data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")}/`; 
  
fs.access(dirPath, (error) => { 
  
  // To check if given directory  
  // already exists or not 
  if (error) { 
    // If current directory does not exist then create it 
    fs.mkdir(dirPath, { recursive: true }, (error) => { 
      if (error) { 
        console.log(error);
        next();
      } else { 
        console.log("New Directory created successfully !!");
        next();
      } 
    }); 
  } else { 
    console.log("Given Directory already exists !!");
    next();
  } 
}); 

}


module.exports = {
        createDir
}