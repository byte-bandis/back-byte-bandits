'use strict';
const { Responder } = require('cote');
const { transporter } = require('../utils/nodeMailer'); 

const responder = new Responder({ name: 'nodemailer', key: 'email' });


responder.on('create-mail', async (req, done) => {
  const { email, subject, html } = req;
  try {

    const sendedMail = await transporter.sendMail({
      from: 'ICraftYouMaster@gmail.com',
      to: email,
      subject: subject,
      html: html,
    });
    console.log('Email enviado:', subject);
    if (!sendedMail) {
      return done({ message: 'Email_not_sent' });
    }

    done(null, { message: 'Email_sent_successfully' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    done(error);
  }
});
