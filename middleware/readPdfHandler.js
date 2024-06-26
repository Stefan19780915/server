const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");
const Contract = require('../model/Contract');
const moment = require("moment");
moment.locale("sk");


function pdfRead (fileName){
    
    return async (req, res,)=>{

        const data = await Employee.findOne({ _id: req.params.id }).populate(
            "store"
          ).populate("position");

          const contract = await Contract.findOne({ employee: data._id, contractState: true });
    
        const filePath = path.join(__dirname,`../data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")} ${fileName}.pdf`);
        
    
        const file = fs.readFileSync(`${filePath}`);
        const stat = fs.statSync(`${filePath}`);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${fileName}.pdf`);
        res.send(file);
        res.end();
    }
}

module.exports = {
        pdfRead
}