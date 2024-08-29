const xlsx = require('xlsx');


const hrKpisUpload = (req, res, next)=>{

  function excelDateToJSDate(date) {
    const jsDate = new Date((date - 25569) * 86400000);
    return jsDate;
  }


    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        jsonData.forEach(row => {
          const excelDate = row['date'];
          if (typeof excelDate === 'number') {
            const jsDate = excelDateToJSDate(excelDate);
            row['date'] = jsDate;
          }
        });

       //console.log(jsonData);
        req.hrKpis = jsonData; 
        next();
        //res.json(jsonData);
      } catch (error) {
        console.error(error);
        //res.status(500).json({ error: 'Failed to process the uploaded file' });
      }
}


module.exports = {
    hrKpisUpload
  };
  