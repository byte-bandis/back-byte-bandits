"use strict";

require("dotenv").config();
const connection = require("../utils/connectMogoose");

const readline = require("node:readline");

const User = require("../models/User");
const PublicProfile = require("../models/PublicProfile");
const data = require("./startedDB.json");
const users = require("./startedUsers.json");
const Ad = require("../models/Ad");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const MyAddress = require("../models/myPersonalData/MyAddress");
const MyCreditCard = require("../models/myPersonalData/MyCreditCard");
const Chat = require("../models/Chat");

function secureQuestion(text) {
  return new Promise((resolve) => {
    // conectar readline con la consola
    const readInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readInterface.question(text, (answer) => {
      readInterface.close();
      resolve(answer.toLowerCase() === "si");
    });
  });
}

async function initUsers() {
  const del = await User.deleteMany();
  const deleteProfiles = await PublicProfile.deleteMany();
  const deleteAddresses = await MyAddress.deleteMany();
  const deleteCreditCards = await MyCreditCard.deleteMany();
  console.log(`Se han borrado ${del.deletedCount} usuarios.`);
  console.log(`Se han borrado ${deleteProfiles.deletedCount} perfiles.`);
  console.log(`Se han borrado ${deleteAddresses.deletedCount} direcciones.`);
  console.log(`Se han borrado ${deleteCreditCards.deletedCount} tarjetas.`);

  for (const user of users) {
    const insertedUser = await User.create(user);
    const insertedProfile = await PublicProfile.create({
      user: insertedUser._id,
      userPhoto: "UserTemplate.jpg",
      headerPhoto: "UserHeader.jpg",
      userDescription: "Your user description is empty",
    });
    const insertedAddress = await MyAddress.create({
      user: insertedUser._id,
      country: "None",
      streetName: "--",
      streetNumber: "--",
      flat: "--",
      door: "--",
      postalCode: "--",
      city: "--",
    });

    const insertedCreditCard = await MyCreditCard.create({
      user: insertedUser._id,
      creditCard: "----",
      last4Digits: "",
    });
    /* console.log(insertedUser);
        console.log(insertedProfile);
      console.log(insertedAddress);  */
  }

  const insertedUsers = await User.find();
  const insertedProfiles = await PublicProfile.find();
  const insertedAddresses = await MyAddress.find();
  const insertedCreditCards = await MyCreditCard.find();

  console.log(`Se han creado ${insertedUsers.length} usuarios.`);
  console.log(`Se han creado ${insertedProfiles.length} perfiles.`);
  console.log(`Se han creado ${insertedAddresses.length} direcciones.`);
  console.log(`Se han creado ${insertedCreditCards.length} tarjetas.`);
}

async function initAd() {
  const del = await Ad.deleteMany();
  console.log(`Se han borrado ${del.deletedCount} anuncios.`);
  const users = await User.find();
  const n = users.length;
  // Añade anuncios
  let userIndex = 0;
  const updatedData = data.map((item) => {
    item.user = users[userIndex]._id;
    userIndex = (userIndex + 1) % n;
    return item;
  });
  let i = 0;
  for (const item of updatedData) {
    try {
   await Ad.create(item);
  i++;
    } catch (error) {
      console.log(error);
    }
    
  }

  console.log(`Se han creado ${i} anuncios.`);
}
async function initLikes() {
  const del = await Like.deleteMany();
  console.log(`Se han borrado ${del.deletedCount} likes.`);
}
async function initComments() {
  const del = await Comment.deleteMany();
  console.log(`Se han borrado ${del.deletedCount} comments.`);
}
async function initChats() {
  const del = await Chat.deleteMany();
  console.log(`Se han borrado ${del.deletedCount} chats.`);
}
async function main() {
  await new Promise((resolve) => connection.once("open", resolve));
  const deleleAll = await secureQuestion(
    "Estas seguro de que deseas borrar todo el contenido de la base de datos? (si/NO) "
  );
  if (!deleleAll) {
    process.exit();
  } else {
    await initUsers();
    await initAd();
    await initLikes();
    await initComments();
    await initChats();
    connection.close();
  }
}
main().catch((err) => console.log(`Hubo un error ${err}`));
