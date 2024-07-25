const mongoose = require('mongoose');
// en caso de evento error
mongoose.connection.on('error', err => {
    console.log('Error de conexión ', err);
});
// en caso de evento open
mongoose.connection.once('open', () => {
    console.log('Conectado a MongoDB en', mongoose.connection.name);
});
mongoose.connect(process.env.MONGO_URI);
module.exports = mongoose.connection;