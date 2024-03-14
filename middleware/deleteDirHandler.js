const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");
const moment = require("moment");
moment.locale("sk");
    
async function deleteDir (req, res, next){

        const data = await Employee.findOne({ _id: req.params.id }).populate(
            "store"
          ).populate("position");
    
        // Multilevel directory 
const dirPath = `./data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(data.contractStartDate).format("LL")}/`; 
  
fs.access(dirPath, (error) => { 
  
  // To check if given directory  
  // already exists or not 
  if (error) { 
    // If current directory does not exist then create it 
    console.log("Given Directory does not exists!");
    next();
  } else { 
      fs.rm(dirPath, { recursive: true }, (error) => {  
        console.log("Given Directory was deleted!");
        next();
        }); 
  } 
}); 
 

}


module.exports = {
        deleteDir
}