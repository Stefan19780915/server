const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");
const Store = require("../model/Store");
const moment = require("moment");
const { nextDay } = require('date-fns');
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

async function student (req,res, next){
    
  const data = await Employee.findOne({ _id: req.params.id }).populate(
    "store"
  ).populate("position");

  const company = await Store.findOne({ _id: data.store._id}).populate('storeCompany');

  let position = data.position ? data.position.position : "No position"

  const newDate = new Date(data.contractStartDate);

  let signatureDate = !data.contractStartDate ? '' : moment(newDate.setDate(data.contractStartDate.getDate()-1)).format('LL');

  if (!data.compensationDateStart) {

    req.flash("message", 
  `Student Compensation Date Start is not specified.
   Please specify the Compensation Date Start.`);
  return res.redirect("/employee");
   }


    let docDefinition = {
        content: [{text: `O z n á m e n i e    a   č e s t n é    v y h l á s e n i e 
        o d v o d o v á   o d p o č í t a t e ľ n á   p o l o ž k a  (OOP) Š T U D E N T I `, style: 'header'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'}, 
        {text: `k dohode o brigádnickej práci študentov na účely uplatnenia práva podľa § 227a zákona č. 461/2003 Z. z. o sociálnom poistení v znení účinnom od 1. januára 2023.  `,alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `Zamestnanec`,color: 'black',alignment: 'center', style: 'text'},
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
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `Určené zamestnávateľovi:`,color: 'black',alignment: 'center', style: 'text'},

        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},

        {text: company.storeCompany.companyName,alignment: 'center',bold: true, style: 'text'},
        {text: `${company.storeCompany.companyStreet}, ${company.storeCompany.companyStreetNumber}, ${company.storeCompany.companyCity}, ${company.storeCompany.companyCountry}`,alignment: 'center',bold: true, style: 'text'},
        {text: `${company.storeCompany.companyBusinessRegister}, IČO: ${company.storeCompany.companyTaxId}`,alignment: 'center',bold: true, style: 'text'},
        {text: `zastúpený: ${company.storeRGM}`,alignment: 'center',bold: true, style: 'text'},
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
                    text: [{text:`Oznamujem Vám, že dohodu o brigádnickej práci študentov, ktorú som s Vami uzatvoril(a) dňa: `},{text: signatureDate ,bold:true, background: 'lightgray'},{text:`si od vzniku tejto dohody/kalendárneho mesiaca ${ `${moment(data.compensationDateStart).format("LL")}`} určujem podľa § 227a zákona č. 461/2003 Z. z. o sociálnom poistení v znení účinnom od 1. januára 2023 (ďalej len „zákon“) ako dohodu o brigádnickej práci študentov, na ktorú sa bude uplatňovať odvodová odpočítateľná položka (OOP). `}],
                    alignment: 'justify',lineHeight: 2
                  }
              ],
              fontSize: 8
        },
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},

        {
            columns: [
                  {
                    width: '5%',
                    text: '2.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: `Čestne vyhlasujem, že pred podpísaním tohto vyhlásenia som sa oboznámil(a) s poučením na druhej strane tlačiva a taktiež čestne vyhlasujem, že spĺňam podmienky uplatňovania práva podľa § 227a zákona a všetky skutočnosti, ktoré som uviedol(la) v tomto vyhlásení, sú pravdivé.`, lineHeight: 2,
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                  {
                    width: '5%',
                    text: '3.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: `Uvedomujem si právne následky nepravdivého čestného vyhlásenia. `,
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns:[
                {
                    width: '50%',
                    text: [{text:`V ${data.store.storeCity} `},{text: signatureDate, bold:true}],
                    alignment: 'center'
                },
                {
                    width: '50%',
                    text: `
                    ___________________
                    Vlastnoručný podpis`,
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

    if(data.studentCompensation === false || data.contractType == 'TPP' || data.contractType == 'DOPČ'){
      req.flash("message", 
    `Student compensation is not selected OR the constract type is not a STUDENT.
     Please select the Student Deductive Contribution Announcement OR Change the contract type to STUDENT.`);
    return res.redirect("/employee");

    } else {

    const filePath = path.join(__dirname,`../data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(data.contractStartDate).format("LL")}/${data.lastName} ${data.firstName} ${moment(data.contractStartDate).format("LL")} student announcement.pdf`);

    const pdfFile = printer.createPdfKitDocument(docDefinition); 
    pdfFile.pipe(fs.createWriteStream(filePath));
    pdfFile.end();
    next();
    }

    


    }




module.exports = {
  student
}





 