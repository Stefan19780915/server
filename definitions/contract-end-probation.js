const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");
const Store = require("../model/Store");
const moment = require("moment");
moment.locale("sk");

const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf' 
      }
}

const printer = new PdfPrinter(fonts);

async function contractEndProbationPost (req, res, next){
    
  const data = await Employee.findOne({ _id: req.params.id }).populate(
    "store"
  ).populate("position");

  const company = await Store.findOne({ _id: data.store._id}).populate('storeCompany');

  let position = data.position ? data.position.position : "No position"

  const newDate = new Date(data.contractStartDate);
  const newDateEnd = new Date(data.contractEndDate);

  let signatureDate = !data.contractStartDate ? '' : moment(newDate.setDate(data.contractStartDate.getDate()-1)).format('LL');

  let signatureDateEnd = !data.contractEndDate ? '' : moment(newDateEnd.setDate(newDateEnd.getDate()-1)).format('LL');

  let terminationType = data.contractType == 'TPP' ? 'Skončenie pracovného pomeru v skúšobnej dobe' :
                     data.contractType == 'DOBPŠ' ? 'Výpoveď dohody o brigádnickej práci študenta' :
                     data.contractType == 'DOPČ' ? 'Výpoveď dohody o pracovnej činnosti' : '';

  let terminationText = data.contractType == 'TPP' ? 
  `Podľa § 72 Zákonníka práce sa pracovný vzťah dohodnutý medzi zamestnávateľom a zamestnancom pracovnou zmluvou zo dňa ${signatureDate} s nástupom do práce dňa ${moment(data.contractStartDate).format("LL")} sa skončí v rámci skúšobnej doby dňa ${moment(data.contractEndDate).format('LL')}` :
  data.contractType == 'DOBPŠ' ? 
  `Podľa § 228 Zákonníka práce Vám týmto vypovedám Vašu dohodu o brigádnickej práci študenta zo dňa ${signatureDate} s nástupom do práce dňa ${moment(data.contractStartDate).format("LL")}. Pracovnoprávny vzťah končí 15 dní po doručení tejto výpovede.` :
  data.contractType == 'DOPČ' ?
  `Podľa § 228 Zákonníka práce Vám týmto vypovedám Vašu dohodu o pracovnej činnosti zo dňa ${signatureDate} s nástupom do práce dňa ${moment(data.contractStartDate).format("LL")}. Pracovnoprávny vzťah končí 15 dní po doručení tejto výpovede.` : '';
  
    let docDefinition = {
        content: [{text: terminationType, style: 'header'},
        {text: `uzatvorena podľa Zákonníka práce medzi:`,alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        
        {text: company.storeCompany.companyName ,alignment: 'center',bold: true, style: 'text'},
        {text: `${company.storeCompany.companyStreet}, ${company.storeCompany.companyStreetNumber}, ${company.storeCompany.companyCity}, ${company.storeCompany.companyCountry}`,alignment: 'center',bold: true, style: 'text'},
        {text: `${company.storeCompany.companyBusinessRegister}, IČO: ${company.storeCompany.companyTaxId}`,alignment: 'center',bold: true, style: 'text'},
        {text: `zastúpený: ${company.storeRGM}`,alignment: 'center',bold: true, style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `(ďalej len zamestnávateľ)`,alignment: 'center',bold: true, style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `a`,alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                {
                  width: '50%',
                  text: 'Meno a priezvisko:',
                  alignment: 'right',
                  bold: true
                },
                {
                  width: '50%',
                  text: `${data.firstName} ${data.lastName}`,
                  background: 'lightgray'
                }
              ],
              columnGap: 20,
              fontSize: 8
              
        },
        {
            columns: [
                {
                    width: '50%',
                    text: 'Dátum narodenia:',
                    alignment: 'right',
                    bold: true
                  },
                  {
                    width: '50%',
                    text: `${moment(data.birthDate).format("LL")}`,
                    background: 'lightgray'
                  }
              ],
              columnGap: 20,
              fontSize: 8
        },
        {
            columns: [
                  {
                    width: '50%',
                    text: 'Adresa trvalého bydliska:',
                    alignment: 'right',
                    bold: true
                  },
                  {
                    width: '50%',
                    text: `${data.street} ${data.houseNumber} ${data.city} ${data.postalCode}`,
                    background: 'lightgray'
                  }
              ],
              columnGap: 20,
              fontSize: 8
        },
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `(ďalej len zamestnanec)`,alignment: 'center',bold: true, style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                  {
                    width: '5%',
                    text: '1.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: [{text: terminationText}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 10
        },
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
         {text: `1`,color: 'white',alignment: 'center', style: 'text'},
         {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                  {
                    width: '5%',
                    text: '',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: [{text:`V ${data.store.storeCity} `}, {text: signatureDateEnd, bold:true}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },{text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns:[
                {
                    width: '50%',
                    text: 'zamestnanec (prípadne zákonný zástupca)',
                    alignment: 'center'
                },
                {
                    width: '50%',
                    text: 'zamestnávatel',
                    alignment: 'center'
                }
            ],fontSize: 8
        }
        
        

    ],
    styles:{
        header: {
            fontSize:16,
            bold: true,
            alignment: 'center'
        },
        text: {
            fontSize: 8
        }
    }
    }

    if (data.contractEndDate == 'indefinite'){

      req.flash("message", 
      `No contract end date spcified.
       Please set the end date in the contract settings.`);
      return res.redirect("/employee");
  
      } else {
        
      const filePath = path.join(__dirname,`../data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(data.contractStartDate).format("LL")}/${data.lastName} ${data.firstName} ${moment(data.contractStartDate).format("LL")} contract end probation post.pdf`);
      const pdfFile = printer.createPdfKitDocument(docDefinition); 
      pdfFile.pipe(fs.createWriteStream(filePath));
      pdfFile.end();
      next();
  
      }
    
} 


module.exports = {
  contractEndProbationPost
}





 