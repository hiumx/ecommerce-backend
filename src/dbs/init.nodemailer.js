'use strict';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_APP_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    }
})

module.exports = {
    transporter
}