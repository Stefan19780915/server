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



async function nzdc (req, res, next){


    
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


  const existingPdfBytes = fs.readFileSync('./definitions/nzdc.pdf');


  if(data.children.length == 0 && data.childBonus == true ) {

    req.flash("message", `There are no children specified for the child tax bonus. Please add children in the Employee children section.`);
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
      
            firstPage.drawText(`${ data.taxBonus == true ? 'X' : '' }`, {
                x: 509,
                y: 497,
                size: 15,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });
      
            firstPage.drawText(`${ data.pensioner == true ? 'X' : '' }`, {
                x: 509,
                y: 457,
                size: 15,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });
      
            firstPage.drawText(`${ data.childBonus == true ? 'X' : '' }`, {
                x: 509,
                y: 383,
                size: 15,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });
      
            //CREATE A LOOP - to add the children
           // console.log(data.children);
            function children(h, i, e = data.children.length){
                  let x = h;
                  let y = 325;
      
                  for(i; i< e; i++){
      
                      firstPage.drawText(`${data.children[i].childName} ${data.children[i].childSurname}`, {
                          x: x,
                          y: y,
                          size: 10,
                          font: timesRomanFont,
                          color: rgb(0.1, 0.1, 0.1)
                      });
                      x += 135;
                
                      firstPage.drawText(`${data.children[i].childSocialSecNumber}`, {
                          x: x,
                          y: y,
                          size: 10,
                          font: timesRomanFont,
                          color: rgb(0.1, 0.1, 0.1)
                      });
                      x = 110;
                      y -= 12
                  }
            }
      
            data.children.length < 5 ? children(110, 0) : (children(110, 0, 5), children(340, 5));
      
            //TAX START DAY
      
            firstPage.drawText(`${moment(data.taxStartDate).format('LL')}`, {
                x: 110,
                y: 80,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.1, 0.1, 0.1)
            });
      
      
      const pdfBytes = await pdfDoc.save();
      
          const filePath = path.join(__dirname,`../data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")} nzdc.pdf`);
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
  nzdc
}





 