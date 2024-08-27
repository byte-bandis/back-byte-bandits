/**
 * The JavaScript code initializes a database by deleting existing ads and inserting new ads from a
 * JSON file.
 */
"use strict";

require("dotenv").config();
const connection = require("../utils/connectMogoose");

const readline = require("node:readline");

const User = require("../models/User");
const PublicProfile = require("../models/PublicProfile");
const data = require("./startedDB.json");
const users = require("./startedUsers.json");
const Ad = require("../models/Ad");
const MyAddress = require("../models/myPersonalData/MyAddress");
const MyCreditCard = require("../models/myPersonalData/MyCreditCard");

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
      country: "Please add a country",
      streetName: "Add your street name",
      streetNumber: "Add your street number",
      flat: "Add your flat number",
      door: "Add your flat door",
      postalCode: "Add your postal code",
      city: "Add your city",
      mobilePhoneNumber: "123 123 123",
    });

    const insertedCreditCard = await MyCreditCard.create({
      user: insertedUser._id,
      creditCard: "1234123412341234",
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
  console.log(users);
  // Añade anuncios
  let userIndex = 0;
  const updatedData = data.map((item) => {
    item.user = users[userIndex]._id;
    userIndex = (userIndex + 1) % 2; // Alterna entre 0 y 1
    return item;
  });
  const insertAds = await Ad.insertMany(updatedData);
  console.log(`Se han creado ${insertAds.length} anuncios.`);
}

async function main() {
  await new Promise((resolve) => connection.once("open", resolve));

  const deleteAll = await secureQuestion(
    "Estas seguro de que deseas borrar todo el contenido de la base de datos? (si/NO) "
  );

  if (!deleteAll) {
    process.exit();
  } else {
    await initUsers();
    await initAd();
    connection.close();
  }
}
main().catch((err) => console.log(`Hubo un error ${err}`));
