const pdfmake = require('pdfmake');
const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");
const Contract = require('../model/Contract');
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

const printer = new pdfmake(fonts);

async function payslip (req, res, next){
    
  const data = await Employee.findOne({ _id: req.params.id }).populate(
    "store"
  );

const contract = await Contract.findOne({ employee: data._id, contractState: true  }).populate('position');

let position = contract.position ? contract.position.position : "No position"

const newDate = new Date(contract.contractStartDate);

let signatureDate = !contract.contractStartDate ? '' : moment(newDate.setDate(contract.contractStartDate.getDate()-1)).format('LL');

let contractType = contract.contractType == 'TPP' ? 'Hlavný pracovný pomer' :
                   contract.contractType == 'DOBPŠ' ? 'Dohodu o brigádnickej práci študenta' :
                   contract.contractType == 'DOPČ' ? 'Dohodu o pracovnej činnosti' : '';

    let docDefinition = {
        content: [{text: `Súhlas so zasielaním výplatnej pásky elektronickou formou`, style: 'header'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
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
              fontSize: 10
              
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
                    text: moment(data.birthDate).format("LL"),
                    background: 'lightgray'
                  }
              ],
              columnGap: 20,
              fontSize: 10
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
              fontSize: 10
        },
   
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
                    text: `Dolu podpísaný Miroslav Chovanec zamestnanec Queensway Restaurants Slovakia s.r.o. - KFC Eurovea Bratislava
                           ako dotknutá osoba týmto v zmysle § 130 ods. 5 Zákonníka práce`,
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
            columns: [
                 
                  {
                    width: '90%',
                    text: 'Udeľujem súhlas so zasielaním výplatnej pásky elektronicky.',
                    alignment: 'center',
                    bold: true
                  }
              ],
              fontSize: 11
        },
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
            fontSize: 8
              },
              {

                width: '50%',
                ul: [`Výplatnú pásku žiadam zasielať na mailovú adresu:`],
                alignment: 'justify',
                fontSize: 10
              },
              {

                width: '50%',
                text: data.email, bold: true,
                alignment: 'justify',
                fontSize: 10
              }
            ],
          },
          {text: `1`,color: 'white',alignment: 'left', style: 'text'},
          {
            columns: [
              {
            width: '5%',
            text: '',
            alignment: 'justify',
            fontSize: 8
              },
              {
                width: '50%',
                ul: [`Výplatná páska bude chránená heslom:`],
                alignment: 'left',
                fontSize: 10
              },
              {
                width: '50%',
                text: data.password, bold: true,
                alignment: 'left',
                fontSize: 10
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
                    text: `Datum: ${signatureDate} `,
                    alignment: 'center'
                },
                {
                  width: '50%',
                  text: `___________________________________________________
                                         Podpis Zamestnanca `,
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

    const filePath = path.join(__dirname,`../data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")} payslip.pdf`);
    const pdfFile = printer.createPdfKitDocument(docDefinition); 
    pdfFile.pipe(fs.createWriteStream(filePath));
    pdfFile.end();
    next();

    /*  
    const file = fs.readFileSync(`${filePath}`);
    const stat = fs.statSync(`${filePath}`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=payslip.pdf');
    res.send(file);
    res.end();
    */
    
} 


module.exports = {
  payslip
}





 