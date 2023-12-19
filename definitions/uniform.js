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

async function uniform (req,res){
    
  const data = await Employee.findOne({ _id: req.params.id }).populate(
    "store"
  ).populate("position");

  const company = await Store.findOne({ _id: data.store._id}).populate('storeCompany');

  let position = data.position ? data.position.position : "No position"

  const newDate = new Date(data.contractStartDate);

  let signatureDate = !data.contractStartDate ? '' : moment(newDate.setDate(data.contractStartDate.getDate()-1)).format('LL');



    let docDefinition = {
        content: [{text: `Karta uniformy`, style: 'header'},
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
                    text: 'Tento dokument slúži na zaznamenávanie preberania a odovzdávania uniformy, ktorá je zamestnancom reštaurácii KFC poskytovaná v zmysle interných nariadení a v súlade s platným pracovným poriadkom.',
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
                    text: 'Zamestnanec svojim podpisom na tomto dokumente:',
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
                ul: [{text:'potvrdzuje prevzatie pridelených častí uniformy'}],
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
                ul: [{text:'sa zaväzuje dbať o čistotu, vzhľad a dobrý stav uniformy'}],
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
                ul: [{text:'súhlasí s tým, že v prípade vedomého poškodenia alebo straty uniformy uhradí celú hodnotu zapožičanej uniformy'}],
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
                ul: [{text:'sa zaväzuje v prípade ukončenia pracovného vzťahu vrátiť uniformu v čistom a zachovalom stave alebo v prípade nevrátenia ju uhradiť v plnej miere'}],
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
                text: {text:'Časti uniformy',bold: true},
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
                ul: [{text:'Tričko'}],
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
                ul: [{text:'šiltovka'}],
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
                ul: [{text:'košeľa'}],
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
                ul: [{text:'nohavice'}],
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
                ul: [{text:'menovka'}],
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
                ul: [{text:'mikina'}],
                alignment: 'justify',
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
                columns: [{text:`V ${data.store.storeCity} `},{text: signatureDate, bold:true}],
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


    const pdfFile = printer.createPdfKitDocument(docDefinition); 

    try {
 
     pdfFile.pipe(fs.createWriteStream(`data/${data.lastName} ${data.firstName} uniform.pdf`));
     pdfFile.end();


 
     req.flash(
         "message",
         `Uniform file for employee ${data.lastName} ${data.firstName} was created.`
       );

       //Openning the PDF straigh in a new TAB
      let filePath = path.join(__dirname,`../data/${data.lastName} ${data.firstName} uniform.pdf`);
 
      fs.readFile(filePath, function(err, data){
        res.contentType("application/pdf");
        res.send(data);
      });
       
      // res.redirect("/employee");
 
       } catch (err) {
         console.log(err);
       }

    
} 


module.exports = {
  uniform
}





 