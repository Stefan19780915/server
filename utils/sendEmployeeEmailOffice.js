const nodeMailer = require("nodemailer");
const { eventNames } = require("../model/Store");

const sendEmailOffice = async (to, cc, subject, html) => {

  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: 'stefan.csomor@qweurope.com',
        pass: process.env.PASS_OFFICE,
      }
    });

    return await transporter.sendMail({
      from: '"MAPAL" <stefan.csomor@qweurope.com>',
      to: to,
      cc: cc,
      subject: subject,
      html: html,
    });
  } catch (err) {
    console.log("Email not sent");
    console.log(err);
  }
};

module.exports = sendEmailOffice;
