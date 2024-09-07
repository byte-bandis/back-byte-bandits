const router = require('express').Router();
const { transporter } = require("../utils/nodeMailer");
const { tryCatch } = require("../utils/tryCatch");
import { __ } from "i18n";
import { welcomeTemplate, resetPasswordTemplate } from "../utils/mainTemplates";



router.post('/', tryCatch(async(req, res) => {
    const { email, userName, type } = req.body;
    let html;
    let subject;
    
    switch (type) {
        case 'welcome':
            html = welcomeTemplate(userName);
            subject = __('Welcome_to_the_platform') + ' ' +  userName ;
            break;
        case 'resetPassword':
            const resetLink = 'https://example.com/reset-password';
            subject = __('Reset_your_password') + ' ' +  userName ;
            html = resetPasswordTemplate(userName, resetLink, res);
            break;
        default:
            return res.status(400).json({  message: res.__("Invalid_email_type") });
    }

    const sendedMail = await transporter.sendMail({
        from: 'ICraftYouMaster@gmail.com',
        to: email,
        subject: subject,
        html: html,
    });
    console.log('sendedMail', sendedMail);
    if (!sendedMail) {
        return res.status(500).json({ message: res.__('Email_not_sent') });
    }   
    res.status(200).json({ message: res.__('Email_sent_successfully') });
}))
    
module.exports = router