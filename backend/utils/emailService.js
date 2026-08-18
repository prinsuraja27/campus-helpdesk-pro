const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, text) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured, skipping email to', to);
    return;
  }
  const mailOptions = {
    from: `"Campus Help Desk" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };
  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
