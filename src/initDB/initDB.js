/**
 * The JavaScript code initializes a database by deleting existing ads and inserting new ads from a
 * JSON file.
 */
'use strict';

require('dotenv').config();
const connection = require('/home/santiagomadaw/proyectofinalbootcamp/back-byte-bandits/src/utils/connectMogoose.js');

const readline = require('node:readline');

const User = require('../models/User');
const data = require('./startedDB.json');
const Ad = require('../models/Ad');

function secureQuestion(text) {
    return new Promise((resolve) => {
        // conectar readline con la consola
        const readInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        readInterface.question(text, answer => {
            readInterface.close();
            resolve(answer.toLowerCase() === 'si');
        });
    });
}

async function initUsers() {
    const del = await User.deleteMany();
    console.log(`Se han borrado ${del.deletedCount} users.`);
    
    const inserted = await User.insertMany([
    {
    username: 'admin',
    name: 'Admin',
    lastname: 'Admin',
    email: 'admin@example.com',
    password: `123123`,
    role: 'admin',
    birthdate: new Date('1990-01-01'),
    address: 'Calle administrativa 123',
    creditCard: '1234-5678-9012-3456'
    },
    {
    username: 'user',
    name: 'User',
    lastname: 'User',
    email: 'user@example.com',
    password: `123123`,
    role: 'user',
    birthdate: new Date('1995-01-01'),
    address: 'Calle usuario 123',
    creditCard: '9876-5432-1098-7654'
    }
    ]);
    console.log(`Se han creado ${inserted.length} users.`);
    }
async function initAd() {

    const del = await Ad.deleteMany();
    console.log(`Se han borrado ${del.deletedCount} anuncios.`);
    const users = await User.find();
    console.log(users)
    // Añade anuncios
    let userIndex = 0;
    const updatedData = data.map(item => {
        item.user = users[userIndex]._id;
        userIndex = (userIndex + 1) % 2; // Alterna entre 0 y 1
        return item;
    });
    const insertAds = await Ad.insertMany(updatedData);
    console.log(`Se han creado ${insertAds.length} anuncios.`);
}


async function main() {
    await new Promise(resolve => connection.once('open', resolve));

    const deleleAll = await secureQuestion('Estas seguro de que deseas borrar todo el contenido de la base de datos? (si/NO) ');

    if (!deleleAll) {

        process.exit();

    } else {
        await initUsers();
        await initAd();
        connection.close();

    }
}
main().catch((err) => console.log(`Hubo un error ${err}`));
