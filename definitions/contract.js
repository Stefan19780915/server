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

async function contract (){
    
    const data = await getData();

    const allData = Object.keys(data.data).map((key)=>{
        return `${key}: ${data.data[key]}\n`;
    });

    //console.log(allData.join("\r\n"));

    let docDefinition = {
        content: [{text: `Pracovná zmluva (skrátený úväzok)`, style: 'header'},
        {text: `uzatvorena podľa Zákonníka práce medzi:`,alignment: 'center', style: 'text'},
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
                    text: [{text:'Deň nástupu do práce je '},{text: '1/6/2023.',bold:true, background: 'lightgray'},{text: ' Týmto dňom vzniká medzi zamestnávateľom a zamestnancom pracovný pomer.'}],
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
                    text: [{text:'Miestom výkonu práce sú reštauračné prevádzky zamestnávateľa: '},{text: ' v meste Bratislava.',bold:true, background: 'lightgray'},{text: ' Zamestnanec súhlasí s vycestovaním na pracovnú cestu podľa potrieb zamestnávateľa.'}],
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
                    text: [{text:'Funkcia/ typ práce: pracovník reštauračnej prevádzky. Zamestnanec bude pre zamestnávateľa vykonávať práce súvisiace s prípravou jedál a nápojov, obsluhou zákazníkov a predajom pri pokladni, zásobovaním a upratovaním.'}],
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
                    text: [{text:'Pracovný pomer sa dojednáva na dobu určitú do: '},{text: '31/7/2024',bold:true, background: 'lightgray'},{text: ' Skúšobná doba trvá 3 mesiace.'}],
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
                    text: [{text:'Hrubá hodinová mzda zamestnanca je dohodnutá vo výške: '},{text: '6 euro',bold:true, background: 'lightgray'},{text: ' a bude vyplácaná bezhotovostne mesačne do 15.dňa nasledujúceho kalendárneho mesiaca na zamestnancom zadaný osobný účet.'}],
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
                    text: [{text:'Pracovný čas mimo práce nadčas je: '},{text: '30 hodín.',bold:true, background: 'lightgray'},{text: ' Prestávka v práci na jedenie a oddych sa nezapočítava do pracovného času.'}],
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
                    text: [{text:'Rozvrhnutie pracovnej doby stanoví v súlade s ustanoveniami ZP a inými právnymi predpismi na jednotlivý kalendárny týždeň zamestnávateľ vždy najneskôr týždeň vopred. Je dohodnuté nerovnomerné rozvrhnutie pracovného času. Maximálna dĺžka týždenného pracovného času vrátane práce nadčas je stanovená v §85 ZP. '}],
                    alignment: 'left'
                  }
              ],
              fontSize: 8
        }, {text: `1`,color: 'white',alignment: 'center', style: 'text'},
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
                    text: [{text:'Výmera dovolenky je v súlade s ustanoveniami § 101 až § 105 ZP a to štyri týždne (päť týždňov ak zamestnanec dovŕši 15 rokov pracovného pomeru po 18.roku veku) za celý kalendárny rok prípadne alikvotná časť. Výpovedná doba je stanovená v §62 a §65 Zákonníka práce (dva prípadne tri mesiace). '}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        }, {text: `1`,color: 'white',alignment: 'center', style: 'text'},
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
                    text: [{text:'Zamestnanec sa zaväzuje:',bold:true}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },
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
                    ul: [{text:'vykonávať podľa pokynov zamestnávateľa všetky práce vyplývajúce z jeho pracovného zaradenia a zúčastňovať sa školení, tréningov a ďalšieho vzdelávania nariadeného zamestnávateľom'}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },
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
                    ul: [{text:'hlásiť zamestnávateľovi všetky zmeny v osobných údajoch, ku ktorým dôjde počas trvania pracovného pomeru ako aj zmenu zdravotnej poisťovne'}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },
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
                    ul: [{text:'zachovávať mlčanlivosť o všetkých skutočnostiach, ktoré sa týkajú záujmov zamestnávateľa, jeho partnerov a zamestnancov a o všetkých ďalších veciach, o ktorých sa dozvedel pri výkone prác pre zamestnávateľa. Táto povinnosť trvá i po skončení pracovného pomeru so zamestnávateľom.'}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },
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
                    ul: [{text:'vykonávať prácu osobne, v určenom pracovnom čase a je povinný dodržiavať pracovnú disciplínu.'}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },
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
                    ul: [{text:'v styku so zákazníkmi , partnermi zamestnávateľa a kontrolnými orgánmi bude vystupovať tak, aby svojím konaním, vzhľadom, slovným prejavom a pod. nepoškodil dobré meno zamestnávateľa a jeho obchodné záujmy'}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        },
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
                    ul: [{text:'riadiť sa príkazmi svojho nadriadeného, vnútornými predpismi zamestnávateľa a predpismi na zabezpečenie bezpečnosti a ochrany zdravia pri práci'}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        }, {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                  {
                    width: '5%',
                    text: '10.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: [{text:'Zamestnanec podpisom tejto zmluvy prehlasuje, že pred uzatvorením zmluvy bol zamestnávateľom oboznámený s právami a povinnosťami, ktoré pre neho vyplývajú z pracovného pomeru, s pracovnými a mzdovými podmienkami, za ktorých bude vykonávať prácu, s prevádzkovými a vnútornými predpismi zamestnávateľa a pravidlami požiarnej ochrany, bezpečnosti a ochrany zdravia vzťahujúce sa na jeho výkon práce a s ustanoveniami o rovnakom zaobchádzaní.'}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        }, {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                  {
                    width: '5%',
                    text: '11.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: [{text:'Zamestnanec súhlasí s poskytnutím svojich osobných údajov zamestnávateľovi a dáva zamestnávateľovi a sprostredkovateľovi súhlas na spracovanie týchto osobných údajov na účely a v nevyhnutne potrebnom rozsahu stanovenom zákonom č. 428/2002 Z.z. a inými relevantnými predpismi.'}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        }, {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                  {
                    width: '5%',
                    text: '12.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: [{text:'Vzťahy výslovne neupravené touto zmluvou sa spravujú platnými právnymi predpismi Slovenskej republiky.'}],
                    alignment: 'justify'
                  }
              ],
              fontSize: 8
        }, {text: `1`,color: 'white',alignment: 'center', style: 'text'},
        {
            columns: [
                  {
                    width: '5%',
                    text: '13.',
                    alignment: 'justify',
                    bold: true
                  },
                  {
                    width: '90%',
                    text: [{text:'Zmluva sa vyhotovuje v dvoch rovnopisoch, jeden pre zamestnávateľa, jeden pre zamestnanca. Zamestnanec svojim podpisom potvrdzuje, že prevzal jeden originál podpísanej pracovnej zmluvy.'}],
                    alignment: 'justify'
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
                    text: [{text:'V Košiciach: '},{text: ' 22/5/2023', bold:true}],
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

    

    




const options = {
    
    }
    
    const pdfFile = printer.createPdfKitDocument(docDefinition, options); 
    pdfFile.pipe(fs.createWriteStream('pdfs/contract.pdf'));
    pdfFile.end();
    
} 


module.exports = {
  contract
}





 