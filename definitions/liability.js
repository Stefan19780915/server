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

async function liability (req,res){
    
  const data = await Employee.findOne({ _id: req.params.id }).populate(
    "store"
  ).populate("position");

  const company = await Store.findOne({ _id: data.store._id}).populate('storeCompany');

  let position = data.position ? data.position.position : "No position"

  const newDate = new Date(data.contractStartDate);

  let signatureDate = !data.contractStartDate ? '' : moment(newDate.setDate(data.contractStartDate.getDate()-1)).format('LL');


    let docDefinition = {
        content: [{text: `Dohoda o hmotnej zodpovednosti`, style: 'header'},
        {text: `uzatvorena podľa Zákonníka práce medzi:`,alignment: 'center', style: 'text'},
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
        {text: `(ďalej len zamestnanec)`,alignment: 'center',bold: true, style: 'text'},
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
                    text: [{text:`Zamestnanec podľa  pracovnej zmluvy, dohody o brigádnickej práci študenta alebo dohody o pracovnej činnosti uzatvorenej dňa: `},{text: signatureDate ,bold:true, background: 'lightgray'},{text: '  vykonáva prácu v pevádzkach zamestnávateľa na pozícii pracovník reštauračnejprevádzky.'}],
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
                    text: '2.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: 'Zamestnanec na základe tejto dohody preberá hmotnú zodpovednosť za schodok na zverených hodnotách, ktoré je povinný zamestnávateľovi pri výkone svojej práce vyúčtovať, a to za zverené hotovosti, ceniny, tovar, zásoby materiálu alebo iné hodnoty určené k vyúčtovaniu. Zamestnanec sa zbaví zodpovednosti celkom, prípadne sčasti, ak preukáže, že schodok vznikol celkom alebo sčasti bez jeho zavinenia.',
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
                    text: 'Zamestnanec je priamo zodpovedný za jemu zverené materiálne hodnoty, s ktorými v rámci svojich pracovných povinností prichádza do styku, hmotná zodpovednosť sa potom vzťahuje aj na prípadné škody vzniknuté na týchto hodnotách.',
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
                    text: '4.',
                    alignment: 'left',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: 'Zamestnanec a zamestnávateľ uzatvárajú týmto v súlade §20 ods.2 Zákonníka práce dohodu o zrážkach zo mzdy/odmeny na zabezpečenie peňažného nároku zamestnávateľa voči zamestnancovi titulom schodku na hodnotách zverených na vyúčtovanie v rozsahu zodpovednosti prevzatej touto dohodou o hmotnej zodpovednosti',
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        }, {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                  {
                    width: '5%',
                    text: '5.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: 'Zamestnanec môže od dohody o hmotnej zodpovednosti odstúpiť, ak sa prevádza na inú prácu, zaraďuje na iné pracovisko, prekladá, alebo pokiaľ zamestnávateľ v čase do jedného mesiaca po tom, čo dostal jeho písomné upozornenie neodstráni nedostatky v pracovných podmienkach, ktoré bránia riadnemu hospodáreniu so zverenými hodnotami.',
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        }, {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                  {
                    width: '5%',
                    text: '6.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: 'Dohoda o hmotnej zodpovednosti zaniká dňom skončenia pracovnoprávneho vzťahu alebo dňom odstúpenia od tejto dohody. Ostatné podmienky zodpovednosti za prípadný schodok vyplývajú z ustanovení Zákonníka práce a jeho vykonávacích predpisov.',
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        }, {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                  {
                    width: '5%',
                    text: '7.',
                    alignment: 'left',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: 'Táto dohoda bola vyhotovená v dvoch exemplároch, pričom každá zo strán dostane po jednom vyhotovení.',
                    alignment: 'left'
                  }
              ],
              fontSize: 8
        }, {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        
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
                    text: [{text: {text:`V ${data.store.storeCity} `}},{text: signatureDate, bold:true}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },{text: `1`,color: 'white',alignment: 'center', style: 'text'},
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

    
    const pdfFile = printer.createPdfKitDocument(docDefinition); 

    try {
 
     pdfFile.pipe(fs.createWriteStream(`data/${data.lastName} ${data.firstName} liability.pdf`));
     pdfFile.end();
 
     req.flash(
         "message",
         `Liability file for employee ${data.lastName} ${data.firstName} was created.`
       );


       let readyPdf =fs.readFileSync(path.join(__dirname,`../data/${data.lastName} ${data.firstName} liability.pdf`));
       res.contentType("application/pdf");
       res.send(readyPdf); 

       //res.redirect("/employee");
 
       } catch (err) {
         console.log(err);
       }
 
} 


module.exports = {
  liability
}





 