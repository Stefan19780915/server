const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");
const Store = require("../model/Store");
const Contract = require('../model/Contract');
const moment = require("moment");
moment.locale("sk");
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf' 
      }
}



async function zdep (req, res, next){


    
    const data = await Employee.findOne({ _id: req.params.id }).populate(
      "store"
    );

    const contract = await Contract.findOne({ employee: data._id, contractState: true  }).populate('position');    

    const company = await Store.findOne({ _id: data.store._id}).populate('storeCompany');

    let position = contract.position ? contract.position.position : "No position"

    const newDate = new Date(contract.contractStartDate);

    let signatureDate = !contract.contractStartDate ? '' : moment(newDate.setDate(contract.contractStartDate.getDate()-1)).format('LL');

    let contractType = contract.contractType == 'TPP' ? 'Pracovná zmluva' :
                       contract.contractType == 'DOBPŠ' ? 'Dohoda o brigádnickej práci študenta' :
                       contract.contractType == 'DOPČ' ? 'Dohoda o pracovnej činnosti' : '';


  const existingPdfBytes = fs.readFileSync('./definitions/zdep.pdf');


  if(!data.store.storeEmail) {

    req.flash("message", `No email address specified for the employee. Please update the email field.`);
    return res.redirect("/employee");

    } else {



        try{
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
      
            pdfDoc.registerFontkit(fontkit);
            const fontBytes = fs.readFileSync(fonts.Roboto.normal);
            const customFont = await pdfDoc.embedFont(fontBytes)
      
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
            const timesRomanFont = customFont;
      
      
            const pages = pdfDoc.getPages();
            const firstPage = pages[0]
            const { width, height } = firstPage.getSize();
            const secondPage = pages[1];
        
            firstPage.drawText(`${company.storeCompany.companyName} ${company.storeCompany.companyStreet}, ${company.storeCompany.companyStreetNumber}, ${company.storeCompany.companyCity}`, {
                x: 120,
                y: 732,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });

            firstPage.drawText(`${company.storeEmail}`, {
                x: 120,
                y: 716,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });

            firstPage.drawText(`${data.firstName} ${data.lastName}`, {
                x: 140,
                y: 625,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });

            firstPage.drawText(`${moment(data.birthDate).format('LL')}`, {
                x: 140,
                y: 609,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });
      
            firstPage.drawText(`${data.street == undefined ? '' :data.street} ${data.houseNumber == undefined ? '' : data.houseNumber } ${data.postalCode == undefined ? '' : data.postalCode } ${data.city == undefined ? '' : data.city }`, {
                x: 140,
                y: 593,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });

            firstPage.drawText(` ${data.email} `, {
                x: 140,
                y: 577,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });

            firstPage.drawText(` ${data.password} `, {
                x: 140,
                y: 561,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });

            secondPage.drawText(` ${company.storeCompany.companyCity}`, {
                x: 60,
                y: 646,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });

            secondPage.drawText(`${moment(contract.contractStartDate).format('LL')}`, {
                x: 150,
                y: 646,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });

            secondPage.drawText(` ${company.storeCompany.companyCity}`, {
                x: 320,
                y: 646,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });

            secondPage.drawText(`${moment(contract.contractStartDate).format('LL')}`, {
                x: 410,
                y: 646,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });

      
      
      const pdfBytes = await pdfDoc.save();
      
          const filePath = path.join(__dirname,`../data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")} zdep.pdf`);
         fs.writeFileSync(filePath,pdfBytes);
          next();
      
      
      
      
        } catch (err){
            console.log(err)
        }


    }


  





    
    
/*
    const file = fs.readFileSync(`${filePath}`);
    const stat = fs.statSync(`${filePath}`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=contract.pdf');
    res.send(file);
    res.end();
    */

 
}


module.exports = {
  zdep
}





 