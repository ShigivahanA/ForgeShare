const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using Gmail settings as default based on the provided credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const message = {
    from: `"ForgeShare" <${process.env.MAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || null
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
