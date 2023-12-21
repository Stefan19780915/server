const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");


function pdfRead (fileName){
    
    return async (req, res,)=>{

        const data = await Employee.findOne({ _id: req.params.id }).populate(
            "store"
          ).populate("position");
    
        const filePath = path.join(__dirname,`../data/${data.lastName} ${data.firstName} ${fileName}.pdf`);
    
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