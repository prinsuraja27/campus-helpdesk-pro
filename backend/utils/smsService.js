const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

async function sendSMS(to, body) {
  if (!client) {
    console.log('Twilio not configured, skipping SMS to', to);
    return;
  }
  try {
    return client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
  } catch (err) {
    console.error('Twilio error', err.message);
  }
}

module.exports = sendSMS;
