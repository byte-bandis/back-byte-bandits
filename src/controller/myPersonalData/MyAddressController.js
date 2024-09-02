const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { tryCatch } = require("../../utils/tryCatch");
const MyAddress = require("../../models/myPersonalData/MyAddress");

exports.createMyAddress = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: res.__("No token provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("Invalid token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const { country, streetName, streetNumber, flat, door, postalCode } =
    req.body;

  const username = req.user.username;

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: res.__("User") + " " + `${username}` + " " + res.__("not found"),
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message:
        res.__("Forbidden, you are not the owner of") +
        " " +
        `${username}'s` +
        " " +
        "account",
    });
  }

  const newAddress = await MyAddress.create({
    user,
    country,
    streetName,
    streetNumber,
    flat,
    door,
    postalCode,
  });

  if (!newAddress) {
    return res.status(500).json({
      status: "error",
      message: res.__("Error creating address for user") + " "`${username}`,
    });
  }

  res.status(200).json({
    status: "success",
    message: res.__("New address created for user") + " "`${username}`,
    data: {
      address: newAddress,
    },
  });
});

exports.getMyAddress = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: res.__("No token provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("Invalid token"),
    });
  }

  const requesterId = decodedToken.user._id;

  const username = req.user.username;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      status: "error",
      message: res.__("User") + " " + `${username}` + " " + res.__("not found"),
    });
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message:
        res.__("Forbidden, you are not the owner of") +
        " " +
        `${username}` +
        res.__("'s") +
        " " +
        res.__("account"),
    });
  }

  const myAddress = await MyAddress.findOne({
    user,
  }).populate({
    path: "user",
    select: "username",
  });

  if (!myAddress) {
    return res.status(404).json({
      status: "error",
      message: res.__("No address found for user") + " "`${username}`,
    });
  }

  res.status(200).json({
    status: "success",
    message:
      res.__("Registered address for") +
      " " +
      `${username}` +
      " " +
      res.__("loaded successfully!"),
    data: {
      address: myAddress,
    },
  });
});

exports.updateMyAddress = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: res.__("No token provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("Invalid token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const incomingCountry = req.body.country;
  const incomingStreetName = req.body.streetName;
  const incomingStreetNumber = req.body.streetNumber;
  const incomingFlat = req.body.flat;
  const incomingDoor = req.body.door;
  const incomingPostalCode = req.body.postalCode;
  const incomingCity = req.body.city;
  const username = req.user.username;

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: res.__("User") + " " + `${username}` + " " + res.__("not found"),
    });
  }

  const user = linkedUser._id;
  const retrievedAddress = await MyAddress.findOne({
    user,
  });

  if (!retrievedAddress) {
    return res.status(404).json({
      status: "error",
      message: res.__("No address found for user") + " "`${username}`,
    });
  }

  if (requesterId !== retrievedAddress.user.toString()) {
    if (requesterId !== user.toString()) {
      return res.status(403).json({
        status: "error",
        message:
          res.__("Forbidden, you are not the owner of") +
          " " +
          `${username}` +
          res.__("'s") +
          " " +
          res.__("account"),
      });
    }
  }

  const data = {
    country: incomingCountry || "None",
    streetName: incomingStreetName || "--",
    streetNumber: incomingStreetNumber || "--",
    flat: incomingFlat || "--",
    door: incomingDoor || "--",
    postalCode: incomingPostalCode || "--",
    city: incomingCity || "--",
  };

  const updatedAddress = await MyAddress.findByIdAndUpdate(
    retrievedAddress._id,
    data,
    { new: true }
  );

  if (!updatedAddress) {
    return res.status(500).json({
      status: "error",
      message: res.__("Could not update address for") + " " + `${username}`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `${username}'s` + " " + req.__("address updated successfully!!"),
    data: {
      address: updatedAddress,
    },
  });
});

exports.deleteMyAddress = tryCatch(async (req, res) => {
  const username = req.user.username;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: res.__("No token provided"),
    });
  }

  const token = authHeader.split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("Invalid token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      status: "error",
      message: res.__("User") + " " + `${username}` + " " + res.__("not found"),
    });
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    if (requesterId !== user.toString()) {
      return res.status(403).json({
        status: "error",
        message:
          res.__("Forbidden, you are not the owner of") +
          " " +
          `${username}'s` +
          " " +
          "account",
      });
    }
  }

  const retrievedAddress = await MyAddress.findOne({ user });

  if (!retrievedAddress) {
    return res.status(404).json({
      status: "error",
      message: res.__("No address found for user") + " " + `${username}`,
    });
  }

  const addressId = retrievedAddress._id;

  const deletedAddress = await MyAddress.deleteOne({ _id: addressId });

  if (deletedAddress.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message:
        res.__("Something when wrong, could not delete address for") +
        " " +
        `${username}`,
    });
  }

  res.status(200).json({
    status: "success",
    message: res.__("Address deleted for user") + " " + `${username}`,
  });
});
