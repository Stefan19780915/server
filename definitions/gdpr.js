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

async function gdpr (){
    
    const data = await getData();

    const allData = Object.keys(data.data).map((key)=>{
        return `${key}: ${data.data[key]}\n`;
    });

    //console.log(allData.join("\r\n"));

    let docDefinition = {
        content: [{text: `Oznámenie informácií dotknutej osobe o spracúvaní osobných údajov`, style: 'header'},
        {text: `v zmysle ustanovenia § 19 zákona č. 18/2018 Z.z. o ochrane osobných údajov v znení neskorších predpisov `,alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `Na základe ustanovenia § 19 zákona č. 18/2018 Z.z. o ochrane osobných údajov v znení neskorších právnych predpisov (ďalej len „Zákon“) Vám ako dotknutej osobe oznamujeme nasledovné informácie o spracúvaní Vašich osobných údajov, ktoré ste nám poskytli. `,alignment: 'center', style: 'text',bold: true},

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
                    text: 'Prevádzkovateľom je spoločnosť Queensway Restaurants Slovakia, s.r.o., so sídlom EUROVEA Central 1, Pribinova 4, 811 09 Bratislava, IČO 35 852 143, zapísaná v Obchodnom registri Okresného súdu Bratislava I, oddiel Sro, vložka č. 28229/B, zastúpená: Naushad Nurdin Jivraj, konateľ (ďalej len „prevádzkovateľ“).',
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
                  text: 'Účelom spracúvania osobných údajov je: a) Plnenie povinností zamestnávateľa súvisiacich s pracovným pomerom alebo obdobným vzťahom vrátane predzmluvných vzťahov,',
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
                  text: 'Právny základ spracúvania osobných údajov je: a) § 13 ods. 1 písm. c) Zákona - právny predpis (Zákonník práce, zákon o účtovníctve, zákon o zdravotnom poistení, zákon o sociálnom poistení, zákon o doplnkovom dôchodkovom sporení, zákon o dani z príjmov, zákon o službách zamestnanosti,......) v prípade spracúvania osobných údajov za účelom podľa: ods. 3 bod a) vyššie,  b) § 13 ods. 1 písm. b) Zákona - zmluva, v prípade spracúvania osobných údajov za účelom podľa: ods. 3 bod  a) vyššie.',
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
                  alignment: 'justify',
                  bold: true
                },
                {
                  width: '90%',
                  text: 'Príjemcom, resp. kategóriou príjemcov osobných údajov sú:  spoločnosti v skupine, komerčné poisťovne, sprostredkovateľom sú externé účtovné, vzdelávacie, personálne a mzdové spoločnosti.',
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
                  text: '5.',
                  alignment: 'justify',
                  bold: true
                },
                {
                  width: '90%',
                  text: 'Spracúvané osobné údaje sú:  meno a priezvisko, trvalé bydlisko, telefonický kontakt, dátum narodenia, číslo účtu, rodinný stav, rodné číslo, číslo OP. ',
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
                  text: '6.',
                  alignment: 'justify',
                  bold: true
                },
                {
                  width: '90%',
                  text: 'Doba uchovávania osobných údajov, resp. kritéria pre určenie tejto doby:  Osobné údaje musia byť uchovávané dovtedy, kým je to potrebné na účel, na ktorý sa osobné údaje spracúvajú; osobné údaje sa môžu uchovávať dlhšie, ak sa majú spracúvať výlučne na účel archivácie, na vedecký účel, na účel historického výskumu alebo na štatistický účel na základe osobitného predpisu a ak sú dodržané primerané záruky ochrany práv dotknutej osoby.',
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
                  text: '7.',
                  alignment: 'justify',
                  bold: true
                },
                {
                  width: '90%',
                  text: 'Poskytnutie osobných údajov zo strany dotknutej osoby je: zmluvnou požiadavkou: Áno, požiadavkou potrebnou k uzatvoreniu zmluvy: Áno',
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
                text: '8.',
                alignment: 'justify',
                bold: true
              },
              {
                width: '90%',
                text: 'Následky neposkytnutia osobných údajov prevádzkovateľovi: nie je možné uzatvorenie pracovnej zmluvy a plnenie zákonných povinností zamestnávateľa.',
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
                text: '9.',
                alignment: 'justify',
                bold: true
              },
              {
                width: '90%',
                text: 'Dotknutá osoba má právo:',
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
                text: ' ',
                alignment: 'justify',
                bold: true
              },
              {
                width: '90%',
                ul: [{text:'požadovať od prevádzkovateľa prístup k osobným údajom týkajúcich sa dotknutej osoby v zmysle § 21 Zákona'}],
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
              text: ' ',
              alignment: 'justify',
              bold: true
            },
            {
              width: '90%',
              ul: [{text:' na opravu osobných údajov v zmysle § 22 Zákona'}],
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
            text: ' ',
            alignment: 'justify',
            bold: true
          },
          {
            width: '90%',
            ul: [{text:'na vymazanie osobných údajov v zmysle § 23 Zákona'}],
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
          text: ' ',
          alignment: 'justify',
          bold: true
        },
        {
          width: '90%',
          ul: [{text:'na obmedzenie spracúvania osobných údajov v zmysle § 24 Zákona'}],
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
          text: ' ',
          alignment: 'justify',
          bold: true
        },
        {
          width: '90%',
          ul: [{text:'namietať spracúvanie osobných údajov v zmysle § 27 Zákona'}],
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
          text: ' ',
          alignment: 'justify',
          bold: true
        },
        {
          width: '90%',
          ul: [{text:'na prenosnosť osobných údajov v zmysle § 26 Zákona'}],
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
          text: ' ',
          alignment: 'justify',
          bold: true
        },
        {
          width: '90%',
          ul: [{text:'aby sa na ňu nevzťahovalo rozhodnutie, ktoré je založené výlučne na automatizovanom spracúvaní osobných údajov vrátane profilovania a ktoré má právne účinky, ktoré sa jej týkajú alebo ju obdobne významne ovplyvňujú za podmienok uvedených v § 28 Zákona'}],
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
          text: ' ',
          alignment: 'justify',
          bold: true
        },
        {
          width: '90%',
          ul: [{text:'kedykoľvek odvolať svoj súhlas so spracúvaním osobných údajov'}],
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
          text: ' ',
          alignment: 'justify',
          bold: true
        },
        {
          width: '90%',
          ul: [{text:'podať návrh na začatie konania podľa § 100 Zákona v prípade, ak tvrdí, že je priamo dotknutá na svojich právach ustanovených Zákonom'}],
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
          text: ' ',
          alignment: 'justify',
          bold: true
        },
        {
          width: '90%',
          ul: [{text:'pred ďalším spracúvaním osobných údajov na poskytnutie informácie o inom účele, ak má prevádzkovateľ v úmysle ďalej spracúvať osobné údaje na iný účel ako ten, na ktorý boli získané.'}],
          alignment: 'justify'
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
                columns: [{text:`V Košiciach: ${data.data.firstName}`,bold: true}],
                alignment: 'left',
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
                columns: [{text:`Meno a Priezvisko: Miroslav Chovanec`,bold: true}],
                alignment: 'left',
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
                columns: [{text:`Stredisko: KFC Aupark`,bold: true}],
                alignment: 'left',
                fontSize: 8
              }
            ],
          },
          
       
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns:[
                {
                    width: '100%',
                    text: 'Podpis zamestnanca (prípadne zákonný zástupca)',
                    alignment: 'right'
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
    pdfFile.pipe(fs.createWriteStream('pdfs/gdpr.pdf'));
    pdfFile.end();
    
} 


module.exports = {
  gdpr
}





 