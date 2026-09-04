const nodemailer = require("nodemailer");
const { gmail } = require("../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: gmail.user,
    clientId: gmail.clientId,
    clientSecret: gmail.clientSecret,
    refreshToken: gmail.refreshToken
  }
});

const sendEmail = ({ to, subject, html }) => {
  return transporter.sendMail({
    from: gmail.user,
    to,
    subject,
    html
  });
};

module.exports = { sendEmail };
