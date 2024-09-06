const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Debe ser false para TLS explícito (puerto 587)
    auth: {
        user: "icraftyoumaster@gmail.com",
        pass: "kaqy wxsm culf fhaw", // Contraseña de aplicación
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Error in transporter configuration: ", error);
    } else {
        console.log("Server is ready to send emails");
    }
});

module.exports = {transporter};
