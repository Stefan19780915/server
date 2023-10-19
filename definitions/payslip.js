const PdfPrinter = require('pdfmake');
const fs = require('fs');
const getData = require('./axios');

const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf' 
      }
}

const printer = new PdfPrinter(fonts);

async function payslip (){
    
    const data = await getData();

    const allData = Object.keys(data.data).map((key)=>{
        return `${key}: ${data.data[key]}\n`;
    });

    //console.log(allData.join("\r\n"));

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
                  text: 'Miroslav Chovanec',
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
                    text: '01/09/1978',
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
                    text: 'Hlavé námesite 2 Dvory nad Žitavou 941 31',
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

                width: '90%',
                ul: [{text:'Výplatnú pásku žiadam zasielať na mailovú adresu: miro@hotmail.com'}],
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
                ul: [{text:'V zmysle ochrany osobných údajov bude chránená heslom: 123'}],
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
                    text: `Datum: 27/8/2023 `,
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

    

    




const options = {
    
    }
    
    const pdfFile = printer.createPdfKitDocument(docDefinition, options); 
    pdfFile.pipe(fs.createWriteStream('pdfs/payslip.pdf'));
    pdfFile.end();
    
} 


module.exports = {
  payslip
}





 