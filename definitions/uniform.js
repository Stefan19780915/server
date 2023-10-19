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

async function uniform (){
    
    const data = await getData();

    const allData = Object.keys(data.data).map((key)=>{
        return `${key}: ${data.data[key]}\n`;
    });

    //console.log(allData.join("\r\n"));

    let docDefinition = {
        content: [{text: `Karta uniformy`, style: 'header'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        
        {text: `Queensway Restaurants Slovakia, s.r.o.`,alignment: 'center',bold: true, style: 'text'},
        {text: `EUROVEA Central 3, Pribinova 10`,alignment: 'center',bold: true, style: 'text'},
        {text: `IČO: 35 852 143  OR: OS Bratislava I, 28229/B`,alignment: 'center',bold: true, style: 'text'},
        {text: `zastúpený: ${data.data.firstName} ${data.data.lastName}`,alignment: 'center',bold: true, style: 'text'},
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
                columns: [{text:`V ${data.data.firstName} dňa: ${data.data.lastName}`}],
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

    

    




const options = {
    
    }
    
    const pdfFile = printer.createPdfKitDocument(docDefinition, options); 
    pdfFile.pipe(fs.createWriteStream('pdfs/uniform.pdf'));
    pdfFile.end();
    
} 


module.exports = {
  uniform
}





 