const { Router } = require("express");
const { transporter } = require("../utils/nodeMailer");



const nodemailerRouter = Router();

nodemailerRouter.post('/', async(req, res) => {
    const { email, userName } = req.body;
    await transporter.sendMail({
        from: 'ICraftYouMaster',
        to: email,
        subject: 'Gracias por registrarse',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h1>Gracias por registrarse ${userName}</h1>
        </body>
        </html>`,
    })
})
    
module.exports = nodemailerRouter