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

async function health (req,res,next){
    
  const data = await Employee.findOne({ _id: req.params.id }).populate(
    "store"
  );

  const contract = await Contract.findOne({ employee: data._id }).populate('position');

  const company = await Store.findOne({ _id: data.store._id}).populate('storeCompany');

  let position = contract.position ? contract.position.position : "No position"

  const newDate = new Date(contract.contractStartDate);

  let signatureDate = !contract.contractStartDate ? '' : moment(newDate.setDate(contract.contractStartDate.getDate()-1)).format('LL');

    let docDefinition = {
        content: [{text: `Bezpečnosť pri práci`, style: 'header'},
        {text: `Záznam o poučení novoprijatého zamestnanca:`,alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        
        {text: company.storeCompany.companyName,alignment: 'center',bold: true, style: 'text'},
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
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `(ďalej len zamestnanec)`,alignment: 'center',bold: true, style: 'text'},
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
                    text: 'Zamestnanec bol pred nástupom do práce oboznámený podľa Zákona NR SR o bezpečnosti a ochrane zdravia pri práci č. 367/2001 Z.z. v znení neskorších predpisov a iných relevantných predpisov týkajúcich sa bezpečnosti pri práci.',
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
                    text: 'Predmetom oboznámenia zamestnanca z právnych a ostatných predpisov na zaistenie bezpečnosti a ochrany zdravia pri práci na pracovisku boli nasledovné témy:',
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
                ul: [{text:'predpisy a zásady bezpečnosti pri práci a pracovná disciplína na pracovisku, pohyb na pracovisku a v areáli, zásady bezpečného správania na pracoviskách, pracovné postupy'}],
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
                ul: [{text:'povinnosti zamestnávateľa z hľadiska bezpečnosti pri práci'}],
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
                ul: [{text:'práva a povinnosti zamestnanca z hľadiska bezpečnosti pri práci'}],
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
                ul: [{text:'oboznámenie s pracovnými rizikami vyplývajúcich z pracovných činností'}],
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
                ul: [{text:'používanie osobných ochranných pracovných pomôcok'}],
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
                ul: [{text:'skladovanie a manipulácia s tovarom'}],
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
                ul: [{text:'obsluha strojov a zariadení na pracovisku, podľa návodov na obsluhu a údržbu od výrobcu resp. bezpečnostných predpisov, vrátane praktickej ukážky a preskúšania zamestnanca z jeho obsluhy'}],
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
                ul: [{text:'poučenie o obsluhe elektrických zariadení a poskytovanie prvej pomoci pri úraze elektrickým prúdom'}],
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
                ul: [{text:'hlásenie, evidencia  a registrácia pracovných úrazov'}],
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
                ul: [{text:'hlásenie a odstraňovanie všetkých nedostatkov, ktoré by mohli ohroziť bezpečnosť a zdravie osôb na pracovisku (resp. porúch strojov a zariadení)'}],
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
                ul: [{text:'zákaz požívania alkoholu a iných omamných látok na pracovisku, zákaz fajčenia'}],
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
                ul: [{text:'požiarne predpisy, prevencia a pravidlá v prípade požiaru'}],
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
                ul: [{text:'interný prevádzkový poriadok'}],
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
                ul: [{text:'systém školení a výcviku týkajúcich sa bezpečnosti pri práci, skúšky a lekárske prehliadky'}],
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
                ul: [{text:'porušenie týchto nariadení a pravidiel a jeho dôsledky'}],
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
                    text: '3.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: 'Zamestnanec bol s touto problematikou riadne oboznámený. Bol ústnou a praktickou (pri obsluhe strojov a zariadení) formou preskúšaný, pričom potvrdzuje svojím podpisom, že zaškoleniu porozumel  a týmto sa zaväzuje, že bude pri práci dodržiavať bezpečnostné predpisy:',
                    alignment: 'justify',
                    bold: true
                  }
              ],
              fontSize: 8
        },
          
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

                width: '45%',
                columns: [{text:`Dátum školenia:`,bold: true},{text:moment(contract.contractStartDate).format('LL'),alignment: 'left'}],
                alignment: 'left',
                fontSize: 8
              },
              {

                width: '45%',
                columns: [{text:`Dátum nástupu do práce:`,bold: true},{text:moment(contract.contractStartDate).format('LL'),alignment: 'left'}],
                alignment: 'left',
                fontSize: 8
              }
            ],
          },
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

                width: '90%',
                columns: [{text:`Meno školiaceho:`,bold: true},{text:`__________________________________`,alignment: 'left'}],
                alignment: 'center',
                fontSize: 8
              }
            ],
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
                    text: 'zamestnanec (prípadne zákonný zástupca)',
                    alignment: 'center'
                },
                {
                    width: '50%',
                    text: 'Podpis školiaceho',
                    alignment: 'center'
                }
            ],fontSize: 8
        },

        
        

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

    const filePath = path.join(__dirname,`../data/${data.store.storeName}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")}/${data.lastName} ${data.firstName} ${moment(contract.contractStartDate).format("LL")} health.pdf`);
    const pdfFile = printer.createPdfKitDocument(docDefinition); 
    pdfFile.pipe(fs.createWriteStream(filePath));
    pdfFile.end();
    next();
    
    /*
    const file = fs.readFileSync(`${filePath}`);
    const stat = fs.statSync(`${filePath}`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=health.pdf');
    res.send(file);
    res.end();
    */
} 




module.exports = {
  health
}





 