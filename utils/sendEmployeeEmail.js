const nodeMailer = require("nodemailer");

const sendEmail = async (to, cc, subject, html) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.USERNAME,
        pass: process.env.PASS,
      },
    });

    return await transporter.sendMail({
      from: process.env.SENDER,
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

module.exports = sendEmail;