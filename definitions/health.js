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

async function health (){
    
    const data = await getData();

    const allData = Object.keys(data.data).map((key)=>{
        return `${key}: ${data.data[key]}\n`;
    });

    //console.log(allData.join("\r\n"));

    let docDefinition = {
        content: [{text: `Lekársky posudok o zdravotnej spôsobilosti zamestnanca na prácu`, style: 'header'},
        {text: `(§ 30e ods. 3 a 6 zákona č. 355/2007 Z. z.)`,alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `Typ prehliadky – Vstupná`,alignment: 'center', style: 'text',bold: true},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `Údaje o zamestnávateľovi: `,alignment: 'center',bold: true, style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `Queensway Restaurants Slovakia, s.r.o.`,alignment: 'center',bold: true, style: 'text'},
        {text: `EUROVEA Central 3, Pribinova 10`,alignment: 'center',bold: true, style: 'text'},
        {text: `IČO: 35 852 143  OR: OS Bratislava I, 28229/B`,alignment: 'center',bold: true, style: 'text'},
        {text: `zastúpený: ${data.data.firstName} ${data.data.lastName}`,alignment: 'center',bold: true, style: 'text'},
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
                    text: '01/09/1978',
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
                    text: 'Hlavé námesite 2 Dvory nad Žitavou 941 31',
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
                    text: `Profesia - pracovné zaradenie - posudzovaná práca: Pracovník prevádzky Team member
                    5246001 – Predavač rýchleho občerstvenia`,
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

    

    




const options = {
    
    }
    
    const pdfFile = printer.createPdfKitDocument(docDefinition, options); 
    pdfFile.pipe(fs.createWriteStream('pdfs/health.pdf'));
    pdfFile.end();
    
} 


module.exports = {
  health
}





 