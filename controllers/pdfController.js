const { personalData } = require("../definitions/personalData");

const fonts = {
  Roboto: {
    normal: "fonts/Roboto-Regular.ttf",
    bold: "fonts/Roboto-Medium.ttf",
    italics: "fonts/Roboto-Italic.ttf",
    bolditalics: "fonts/Roboto-MediumItalic.ttf",
  },
};

const pdfmake = require("pdfmake");
pdfmake.addFonts(fonts);

async function createPersonalData(req, res) {
  const docDefinition = await personalData(req, res);

  const pdf = pdfmake.createPdf(docDefinition);

  try {
    await pdf.write(`data/${docDefinition.pdf}`);
    console.log("Pdf Created");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createPersonalData,
};
