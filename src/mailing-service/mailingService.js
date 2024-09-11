'use strict';
const { Responder } = require('cote');
const { transporter } = require('../utils/nodeMailer'); 

const responder = new Responder({ name: 'nodemailer', key: 'email' });

/* const falsetransporter = {
  sendMail: () => {
    return new Promise((resolve, reject) => {
      reject(new Error('Simulated transport error'));
    });
  },
}; */
responder.on('create-mail', async (req, done) => {
  const { email, subject, html } = req;
  try {
    const sendedMail = await transporter.sendMail({
      from: 'ICraftYouMaster@gmail.com',
      to: email,
      subject: subject,
      html: html,
    });

    if (!sendedMail) {
      return done({ message: 'Email_not_sent' });
    }

    done(null, { message: 'Email enviado correctamente' });
  } catch (error) {
    
    // Enviar error al Requester
    done({ message: 'No enviado', err: error.message }).catch((value) => {
      console.error('Error al enviar el error:', value);
    })
    return;
  }
});
