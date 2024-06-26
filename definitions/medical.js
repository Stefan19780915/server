const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");
const Store = require("../model/Store");
const Contract = require('../model/Contract');
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

async function medical (req, res, next){
    
  const data = await Employee.findOne({ _id: req.params.id }).populate(
    "store"
  );

  const company = await Store.findOne({ _id: data.store._id}).populate('storeCompany');

  const contract = await Contract.findOne({ employee: data._id, contractState: true  }).populate('position');

  let position = contract.position ? contract.position.position : "No position"

  const newDate = new Date(contract.contractStartDate);

  let signatureDate = !contract.contractStartDate ? '' : moment(newDate.setDate(contract.contractStartDate.getDate()-1)).format('LL');

    //console.log(allData.join("\r\n"));

    let docDefinition = {
        content: [{text: `Lekársky posudok o zdravotnej spôsobilosti zamestnanca na prácu`, style: 'header'},
        {text: `(§ 30e ods. 3 a 6 zákona č. 355/2007 Z. z.)`,alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `Typ prehliadky – Vstupná`,alignment: 'center', style: 'text',bold: true},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `Údaje o zamestnávateľovi: `,alignment: 'center',bold: true, style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: company.storeCompany.companyName,alignment: 'center',bold: true, style: 'text'},
        {text: `${company.storeCompany.companyStreet}, ${company.storeCompany.companyStreetNumber}, ${company.storeCompany.companyCity}, ${company.storeCompany.companyCountry}`,alignment: 'center',bold: true, style: 'text'},
        {text: `${company.storeCompany.companyBusinessRegister}, IČO: ${company.storeCompany.companyTaxId}`,alignment: 'center',bold: true, style: 'text'},
        {text: `zastúpený: ${company.storeRGM}`,alignment: 'center',bold: true, style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},

        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `Údaje o zamestnancovi: `,alignment: 'center',bold: true, style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
      
        
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
                    text: `Profesia - pracovné zaradenie - ${position}`,
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
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
                    text: 'Práca podľa osobitných predpisov:*) ',
                    alignment: 'justify',
                    bold: true
                  }
              ],
              fontSize: 8
        },
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {

                width: '90%',
                ul: [{text:'Chemické faktory (Kontaktné alergény a iritanciá) - Kategória 2 '}],
                alignment: 'justify',
                fontSize: 8
              }
            ],
          },
          {text: `1`,color: 'white',alignment: 'center', style: 'text'},
          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {
                width: '90%',
                ul: [{text:'Epidemiologicky závažná činnosť (Zdravotný preukaz)'}],
                alignment: 'justify',
                fontSize: 8
              }
            ],
          },
          {text: `1`,color: 'white',alignment: 'center', style: 'text'},
          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {
                width: '90%',
                ul: [{text:'Fyzická záťaž - Kategória 2'}],
                alignment: 'justify',
                fontSize: 8
              }
            ],
          },
          
          {text: `1`,color: 'white',alignment: 'center', style: 'text'},
          {text: `1`,color: 'white',alignment: 'center', style: 'text'},
          {
            columns: [
              {
            width: '5%',
            text: '3',
            alignment: 'justify',
            fontSize: 8,
            bold: true
              },
              {
                width: '90%',
                text: {text:'Záver',bold: true},
                alignment: 'justify',
                fontSize: 8
              }
            ],
          },
          {text: `1`,color: 'white',alignment: 'center', style: 'text'},
          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {

                width: '90%',
                ul: [{text:'a) Spôsobilý na výkon posudzovanej práce*) '}],
                alignment: 'justify',
                fontSize: 8
              }
            ],
          },
          {text: `1`,color: 'white',alignment: 'center', style: 'text'},
          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {

                width: '90%',
                ul: [{text:'b) Spôsobilý na výkon posudzovanej práce s dočasným obmedzením*) - (uviesť pracovné operácie, ktoré nemôže vykonávať alebo zdraviu škodlivé faktory práce a pracovného prostredia, ktorým nemôže byť vystavený a časové obmedzenie) '}],
                alignment: 'justify',
                fontSize: 8
              }
            ],
          },
          {text: `1`,color: 'white',alignment: 'center', style: 'text'},
          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {

                width: '90%',
                text:'..........................................................................................................................................................................................................',
                alignment: 'justify',
                fontSize: 8
              }
            ],
          },
          {text: `1`,color: 'white',alignment: 'center', style: 'text'},
          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {

                width: '90%',
                ul: [{text:'c) Dlhodobo nespôsobilý na výkon posudzovanej práce*)'}],
                alignment: 'justify',
                fontSize: 8
              }
            ],
          },
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
                    text: `Datum: __________________________________ `,
                    alignment: 'center'
                },
                {
                  width: '50%',
                  text: `___________________________________________________
                          odtlačok pečiatky s uvedením špecializácie lekára
                          a podpis lekára vykonávajúceho lekársku 
                          preventívnu prehliadku vo vzťahu k práci `,
                  alignment: 'center'
              }

            ],fontSize: 8
        },
        
          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {

                width: '90%',
                text:'..........................................................................................................................................................................................................',
                alignment: 'justify',
                fontSize: 8
              }
            ],
          },

          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {

                width: '90%',
                columns: [{text:`*) nehodiace sa prečiarknite. `}],
                alignment: 'justify',
                fontSize: 8
              }
            ],
          },
          {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {

                width: '90%',
                columns: [{text:`1) § 31 ods. 1 až 5 zákona č. 355/2007 Z. z. o ochrane, podpore a rozvoji verejného zdravia a o zmene a doplnení niektorých zákonov v znení neskorších predpisov.`}],
                alignment: 'justify',
                fontSize: 6
              }
            ],
          },
          
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},

        
        

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

    const filePath = path.join(__dirname,`../data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")} medical.pdf`);
    const pdfFile = printer.createPdfKitDocument(docDefinition); 
    pdfFile.pipe(fs.createWriteStream(filePath));
    pdfFile.end();
    next();
    
    /*
    const file = fs.readFileSync(`${filePath}`);
    const stat = fs.statSync(`${filePath}`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=medical.pdf');
    res.send(file);
    res.end();
    */
    
    
}




module.exports = {
  medical
}





 