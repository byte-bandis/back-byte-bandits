'use strict';
const { Responder } = require('cote');
const nodemailer = require('nodemailer');
const { welcomeTemplate, resetPasswordTemplate } = require('../utils/mainTemplates');

const responder = new Responder({ name: 'create-mailing-service', key: 'email' });
// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "icraftyoumaster@gmail.com",
        pass: "kaqy wxsm culf fhaw", 
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Error in transporter configuration: ", error);
    } else {
        console.log("Server is ready to send emails");
    }
});
responder.on('create-mail', async (req, done) => {
  const { email, subject, html } = req;
console.log('microservice', email, subject, html);
  try {
    // Enviar correo electrónico
    const sendedMail = await transporter.sendMail({
      from: 'ICraftYouMaster@gmail.com',
      to: email,
      subject: subject,
      html: html,
    });

    if (!sendedMail) {
      return done({ message: 'Email_not_sent' });
    }

    done(null, { message: 'Email_sent_successfully' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    done(error);
  }
});
