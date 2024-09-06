const router = require('express').Router();
const { transporter } = require("../utils/nodeMailer");
const { tryCatch } = require("../utils/tryCatch");
import { welcomeTemplate, resetPasswordTemplate } from "../utils/mainTemplates";



router.post('/', tryCatch(async(req, res) => {
    const { email, userName, type } = req.body;
    
    let html;
    
    // Seleccionar la plantilla en función del tipo de correo
    switch (type) {
        case 'welcome':
            html = welcomeTemplate(userName);
            break;
        case 'resetPassword':
            const resetLink = 'https://example.com/reset-password'; // Genera o pasa el enlace real
            html = resetPasswordTemplate(userName, resetLink);
            break;
        default:
            return res.status(400).json({ message: 'Tipo de email no soportado' });
    }

    // Enviar el correo
    await transporter.sendMail({
        from: 'ICraftYouMaster@gmail.com',
        to: email,
        subject: type === 'welcome' ? 'Bienvenido a nuestra plataforma' : 'Restaurar tu contraseña',
        html: html,
    });

    res.status(200).json({ message: 'Email sent' });
}))
    
module.exports = router