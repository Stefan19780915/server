const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");
const Store = require("../model/Store");
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



async function nzdc (req, res, next){


    
    const data = await Employee.findOne({ _id: req.params.id }).populate(
      "store"
    ).populate("position");

    const company = await Store.findOne({ _id: data.store._id}).populate('storeCompany');

    let position = data.position ? data.position.position : "No position"

    const newDate = new Date(data.contractStartDate);

    let signatureDate = !data.contractStartDate ? '' : moment(newDate.setDate(data.contractStartDate.getDate()-1)).format('LL');

    let contractType = data.contractType == 'TPP' ? 'Pracovná zmluva' :
                       data.contractType == 'DOBPŠ' ? 'Dohoda o brigádnickej práci študenta' :
                       data.contractType == 'DOPČ' ? 'Dohoda o pracovnej činnosti' : '';


  const existingPdfBytes = fs.readFileSync('./definitions/nzdc.pdf');
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
  
      firstPage.drawText(`${data.lastName}`, {
          x: 82,
          y: 640,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`${data.firstName}`, {
          x: 265,
          y: 640,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`${data.socialSecNumber == undefined ? '' :data.socialSecNumber}`, {
          x: 375,
          y: 640,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      
      firstPage.drawText(`${data.street == undefined ? '' :data.street}`, {
          x: 110,
          y: 603,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`${data.houseNumber == undefined ? '' : data.houseNumber }`, {
          x: 385,
          y: 603,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`${data.postalCode == undefined ? '' : data.postalCode }`, {
          x: 485,
          y: 603,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`${company.storeCompany.companyName}`, {
          x: 110,
          y: 568,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });
      
      firstPage.drawText(`${company.storeCompany.companyStreet}, ${company.storeCompany.companyStreetNumber}, ${company.storeCompany.companyCity}, ${company.storeCompany.companyCountry}`, {
          x: 110,
          y: 558,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`${data.city == undefined ? '' : data.city }`, {
          x: 110,
          y: 590,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`${data.country == undefined ? '' : data.country }`, {
          x: 300,
          y: 590,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText('X', {
          x: 509,
          y: 497,
          size: 15,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText('X', {
          x: 509,
          y: 457,
          size: 15,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText('X', {
          x: 509,
          y: 383,
          size: 15,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`Viktoria Csomorova`, {
          x: 110,
          y: 325,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`235689/8956`, {
          x: 245,
          y: 325,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`Viktoria Csomorova`, {
          x: 110,
          y: 314,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`235689/8956`, {
          x: 245,
          y: 314,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`Viktoria Csomorova`, {
          x: 110,
          y: 302,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`235689/8956`, {
          x: 245,
          y: 302,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });

      firstPage.drawText(`${moment(data.taxStartDate).format('LL')}`, {
          x: 110,
          y: 80,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1)
      });


const pdfBytes = await pdfDoc.save();

const filePath = path.join(__dirname,`../data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(data.contractStartDate).format("LL")}/${data.lastName} ${data.firstName} ${moment(data.contractStartDate).format("LL")} nzdc.pdf`);

   fs.writeFileSync(filePath,pdfBytes);
    next();


  } catch (err){
      console.log(err)
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
  nzdc
}





 