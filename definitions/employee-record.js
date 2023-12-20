const pdfmake = require('pdfmake');
const fs = require('fs');
const path = require('path');
const Employee = require("../model/Employee");
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

const printer = new pdfmake(fonts);

async function employeeRecord (req,res){
    
    const data = await Employee.findOne({ _id: req.params.id }).populate(
        "store"
      ).populate("position");

    let position = data.position ? data.position.position : "No position"

    const newDate = new Date(data.contractStartDate);

    let signatureDate = !data.contractStartDate ? '' : moment(newDate.setDate(data.contractStartDate.getDate()-1)).format('LL');

    let contractType = data.contractType == 'TPP' ? 'Hlavný pracovný pomer' :
                       data.contractType == 'DOBPŠ' ? 'Dohodu o brigádnickej práci študenta' :
                       data.contractType == 'DOPČ' ? 'Dohodu o pracovnej činnosti' : '';

    let docDefinition = {
        content: [{text: `Dotazník pre ${contractType}`, style: 'header'},
        {
            table:{
                headerRows: 0,
                widths: ['*', '*', 100, '*'],
                body: [
                    [{text: 'Meno:', bold:true, style: 'table'},{text:data.firstName, style: 'table'},
                    {text:'Priezvisko:', bold: true, style: 'table'},{text: data.lastName, style: 'table'}],
                    [{text:'',border:[true,true,false,true],style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},
                    {text:'Rodné priezvisko:', bold: true,style: 'table'},{text: data.birthName, style: 'table'}],
                    [{text: 'Dátum narodenia:', bold:true,style: 'table'},{text: moment(data.birthDate).format("LL"), style:'table'},
                    {text:'Rodné číslo:', bold: true,style: 'table'},{text: data.socialSecNumber, style:'table'}],
                    [{text: 'Miesto narodenia:', bold:true,style: 'table'},{text: data.birthPlace, style:'table'},
                    {text:'Číslo OP:', bold: true,style: 'table'},{text: data.idCardNumber,style:'table'}],
                    [{text:'Štátna príslušnosť:', bold: true,style: 'table'},{text: data.country,style:'table'},
                    {text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'}],
                    [{text:'Národnosť:', bold: true,style: 'table'},{text: data.nationality,style:'table'},
                    {text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'}],
                    [{text:'Stav:', bold: true,style: 'table'},{text: data.maritalStatus,style:'table'},
                    {text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'}],
                    [{text:'Tel.číslo mobil:', bold: true,style: 'table'},{text: data.landLinePhone,style:'table'},
                    {text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'}],
                    [{text: 'Emailová adresa:', bold:true,style: 'table'},{text: data.email,style: 'table'},
                    {text:'Heslo (elektronická páska):', bold: true,style: 'table'},{text: data.password,style:'table'}],
                    [{text:'1',border:[true,true,false,true],color: 'white',style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,true,true],style: 'table'}],

                    [{text: 'Adresa trvalého bydliska:', bold:true,style: 'table'},{text: '', style:'table'},{text:'Prechodné bydlisko:', bold: true,style: 'table'},{text: '',style:'table'}],

                    [{text: 'Ulica číslo domu:', bold:true,style: 'table'},{text: `${data.street == undefined ? '' :data.street} ${data.houseNumber == undefined ? '' : data.houseNumber }`, style:'table'},{text:'Ulica číslo domu:', bold: true,style: 'table'},{text: `${data.streetTemp == undefined ? '' : data.streetTemp}  ${data.houseNumberTemp == undefined ? '' : data.houseNumberTemp}`,style:'table'}],

                    [{text: 'Mesto/Obec:', bold:true,style: 'table'},{text: data.city, style:'table'},{text:'Mesto/Obec:', bold: true,style: 'table'},{text: data.cityTemp ,style:'table'}],

                    [{text: 'PSČ:', bold:true,style: 'table'},{text: data.postalCode, style:'table'},{text:'PSČ:', bold: true,style: 'table'},{text: data.postalCodeTemp ,style:'table'}],

                    [{text:'1',border:[true,true,false,true],color: 'white',style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,true,true],style: 'table'}],

                    [{text: 'Rodinný príslušníci:', bold:true,style: 'table'},{text: '', border: [false,false,false,false], style:'table'},{text:'',border:[false,false,false,false],style: 'table'},{text: '',border: [false,false,false,false],style:'table'}],
                    
                    [{text: 'Manžel(ka):', bold:true,style: 'table'},{text: '', bold: true, style: 'table'},{text:'Dátum narodenia:', bold: true,style: 'table'},{text: 'Rodné číslo:',bold: true,style:'table'}],
                    [{text: `${data.spouseName == undefined? '' : data.spouseName} ${data.spouseSurname == undefined ? '' : data.spouseSurname}`,style: 'table'},{text: '', style:'table'},{text: !data.spouseDateOfBirth ? '' : moment(data.spouseDateOfBirth).format("LL") ,style: 'table'},{text: data.spouseSocialSecNumber,style:'table'}],
                    [{text: 'Deti:', bold:true,style: 'table'},{text: '', border: [false,false,false,false], style:'table'},{text:'',border:[false,false,false,false],style: 'table'},{text: '',border: [false,false,false,false],style:'table'}]
                ],
                style: 'table'
            }
        }
    ],
    styles:{
        header: {
            fontSize:16,
            bold: true,
            alignment: 'center'
        },
        table:{
            fontSize: 8
        }
    }
    }

    

    for(let i = 0; i < data.children.length; i++){
        docDefinition.content[1].table.body.push([{text: `${data.children[i].childName} ${data.children[i].childSurname}`,style: 'table'},{text: '', style:'table'},{text: moment(data.children[i].childDateOfBirth).format("LL"),style: 'table'},{text: data.children[i].childSocialSecNumber,style:'table'}]);
    }

docDefinition.content[1].table.body.push([{text:'1',border:[true,true,false,true],color: 'white',style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,true,true],style: 'table'}]);
docDefinition.content[1].table.body.push([{text: 'Zdravotná poisťovňa:', bold:true,style: 'table'},{text: '', border: [false,false,false,true], style:'table'},{text: data.publicHealthInsuranceName,border:[false,false,false,true],style: 'table', colSpan: 2},{text: '',border: [false,false,true,true],style:'table'}]);
docDefinition.content[1].table.body.push([{text:'1',border:[true,true,false,true],color: 'white',style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,true,true],style: 'table'}]);
docDefinition.content[1].table.body.push([{text: 'Názov banky:', bold:true,style: 'table'},{text: '', border: [false,false,false,true], style:'table'},{text: data.bankName,border:[false,false,false,true],style: 'table', colSpan: 2},{text: '',border: [false,false,true,true],style:'table'}]);    
docDefinition.content[1].table.body.push( [{text: 'Číslo účtu (IBAN):', bold:true,style: 'table'},{text:  data.accountNumber, style:'table'},
                                           {text:'Kód banky:', bold: true,style: 'table'},{text: data.bankCode,style:'table'}]);
docDefinition.content[1].table.body.push([{text:'1',border:[true,true,false,true],color: 'white',style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,true,true],style: 'table'}]);
docDefinition.content[1].table.body.push([{text: '(ZŤP / Dôchodca):', bold:true,style: 'table'},{text: '', border: [false,false,false,true], style:'table'},{text:data.ztpDochodca ,border:[false,false,false,true],style: 'table'},{text: '',border: [false,false,true,true],style:'table'}]);
docDefinition.content[1].table.body.push([{text:'1',border:[true,true,false,true],color: 'white',style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,true,true],style: 'table'}]);
docDefinition.content[1].table.body.push([{text: 'Študent - Názov a adresa školy, ktorú navštevujete:', bold:true,style: 'table'},{text: '', border: [false,false,false,true],style:'table'},{text:data.schoolName,border:[false,false,false,true],style: 'table', colSpan: 2},{text: '',border: [false,false,true,true],style:'table'}]);
docDefinition.content[1].table.body.push([{text:'1',border:[true,true,false,true],color: 'white',style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,true,true],style: 'table'}]);
docDefinition.content[1].table.body.push([{text: 'Ak ste zamestnaný v inej firme - Názov a adresa zamestnania:', bold:true,style: 'table'},{text: '', border: [false,false,false,true],style:'table'},{text:data.employerName,border:[false,false,false,true],style: 'table', colSpan: 2},{text: '',border: [false,false,true,true],style:'table'}]);
docDefinition.content[1].table.body.push([{text:'1',border:[true,true,false,true],color: 'white',style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,false,true],style: 'table'},{text:'',border:[false,true,true,true],style: 'table'}]);

docDefinition.content[1].table.body.push( [{text: 'Doplňujúce údaje zamestnávateľa:', bold:true,style: 'table'},{text: '', style:'table'},{text:'Zastúpený RGM:', bold: true,style: 'table'},{text: data.store.storeRGM,style:'table'}]);
docDefinition.content[1].table.body.push([{text: 'Dátum nástupu do zamestnania:', bold:true,style: 'table'},{text: '', border: [false,false,false,true], style:'table'},{text:'',border:[false,false,false,true],style: 'table'},{text: moment(data.contractStartDate).format('LL') ,border: [false,false,true,true],style:'table'}]);
docDefinition.content[1].table.body.push([{text: 'Dátum ukončenia:', bold:true,style: 'table'},{text: '', border: [false,false,false,true], style:'table'},{text:'',border:[false,false,false,true],style: 'table'},{text: data.contractEndDate == 'indefinite' ? 'neurčito' : moment(data.contractEndDate).format('LL') ,border: [false,false,true,true],style:'table'}]);
docDefinition.content[1].table.body.push([{text: 'Predpokladaná výška mzdy:', bold:true,style: 'table'},{text: '', border: [false,false,false,true], style:'table'},{text:'',border:[false,false,false,true],style: 'table'},{text: `${data.contractSalary ? data.contractSalary.toString(): ''} EUR`,border: [false,false,true,true],style:'table'}]);
docDefinition.content[1].table.body.push([{text: 'Druh mzdy (hodinová, mesačná, úkolová):', bold:true,style: 'table'},{text: '', border: [false,false,false,true], style:'table'},{text:'',border:[false,false,false,true],style: 'table'},{text: data.contractSalaryType == 'taskBased' ? 'Ukolová' : data.contractSalaryType == 'monthlySalary' ? 'Mesačná' : data.contractSalaryType == 'hourlyRate' ? 'Hodinová' : '',border: [false,false,true,true],style:'table'}]);
docDefinition.content[1].table.body.push( [{text: 'Druh pracovného pomeru:', bold:true,style: 'table'},{text: data.contractType, style:'table'},{text:'Týždený počet hodín:', bold: true,style: 'table'},{text: data.contractWeeklyHours ? data.contractWeeklyHours.toString() : '',style:'table'}]);
docDefinition.content[1].table.body.push([{text: 'Stredisko:', bold:true,style: 'table'},{text: '', border: [false,false,false,true], style:'table'},{text:'',border:[false,false,false,true],style: 'table'},

{text: `${data.store.storeName}, ${data.store.storeStreet} ${data.store.storeStreetNumber}
        ${data.store.storeCity} `,border: [false,false,true,true],style:'table'}]);

docDefinition.content[1].table.body.push([{text: 'Pracovné zaradenie:', bold:true,style: 'table'},{text: '', border: [false,false,false,true], style:'table'},{text:'',border:[false,false,false,true],style: 'table'},{text: position ,border: [false,false,true,true],style:'table'}]);

docDefinition.content[1].table.body.push([{text:'1',border:[false,false,false,false],color: 'white',style: 'table'},{text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'}]);
docDefinition.content[1].table.body.push([{text:'Miesto podpisu:', bold: true,style: 'table'},{text: `${data.store.storeCity}`,style:'table'},{text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'}]);
docDefinition.content[1].table.body.push([{text:'Dátum podpisu:', bold: true,style: 'table'},{text: signatureDate,style:'table'},{text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'}]);
docDefinition.content[1].table.body.push([{text:'1',border:[false,false,false,false],color: 'white',style: 'table'},{text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'}]);
docDefinition.content[1].table.body.push([{text:'Podpis zamestnanca',alignment: 'center',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'},{text:'',border:[false,false,false,false],style: 'table'},{text:'Podpis zamestnávateľa',alignment: 'center',border:[false,false,false,false],style: 'table'}]);

    const pdfFile = printer.createPdfKitDocument(docDefinition); 
    const filePath = path.join(__dirname,`../data/${data.lastName} ${data.firstName} personal data.pdf`);

    //Creating the PDF
    await createPdf(pdfFile, data);
        
   //Openning the PDF straigh in a new TAB
    await displayPdf(filePath, res);

} 

async function createPdf (pdfFile, data) {
    try {
      pdfFile.pipe(fs.createWriteStream(`data/${data.lastName} ${data.firstName} personal data.pdf`));
      pdfFile.end();
    } catch (err) {
      console.log(err);
    }
  }
  
  async function displayPdf (filePath, res){
    try {
      const readyPdf = fs.readFileSync(filePath);
      res.contentType("application/pdf");
      res.send(readyPdf);
      } catch (err){
          console.error(err);
      }
  }


module.exports = {
    employeeRecord
}





 