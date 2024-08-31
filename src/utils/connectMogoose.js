/* This code snippet is setting up a connection to a MongoDB database using Mongoose, which is an
Object Data Modeling (ODM) library for MongoDB and Node.js. Here's a breakdown of what each part of
the code is doing: */

const mongoose = require('mongoose');
// en caso de evento error
mongoose.connection.on('error', err => {
    console.log('Error de conexión ', err);
});
// en caso de evento open
mongoose.connection.once('open', () => {
    console.log('Conectado a MongoDB en', mongoose.connection.name);
});
console.log(process.env.JWT_EXPIRE);
mongoose.connect(process.env.MONGO_URI);
module.exports = mongoose.connection;