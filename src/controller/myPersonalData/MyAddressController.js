const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { tryCatch } = require("../../utils/tryCatch");
const MyAddress = require("../../models/myPersonalData/MyAddress");

exports.createMyAddress = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }

  const requesterId = decodedToken.user._id;
  const {
    country,
    streetName,
    streetNumber,
    flat,
    door,
    postalCode,
    mobilePhoneNumber,
  } = req.body;

  const username = req.params.username;

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: `User ${username} not found`,
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message: `Forbidden, you are not ${username}`,
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
    mobilePhoneNumber,
  });

  if (!newAddress) {
    return res.status(500).json({
      status: "error",
      message: `Error creating address for user ${username}`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `New address created for user ${username}!`,
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
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }

  const requesterId = decodedToken.user._id;

  const username = req.params.username;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      status: "error",
      message: `User ${username} not found`,
    });
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message: `Forbidden, you are not ${username}`,
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
      message: `No address found for user ${username}`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `Registered address for ${username} loaded successfully!`,
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
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
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
  const incomingMobilePhoneNumber = req.body.mobilePhoneNumber;

  //const username = req.params.username;
  const username = req.user.username;

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: `User ${username} not found`,
    });
  }

  const user = linkedUser._id;
  const retrievedAddress = await MyAddress.findOne({
    user,
  });

  if (!retrievedAddress) {
    return res.status(404).json({
      status: "error",
      message: `No address found for user ${username}`,
    });
  }

  if (requesterId !== retrievedAddress.user.toString()) {
    if (requesterId !== user.toString()) {
      return res.status(403).json({
        status: "error",
        message: `Forbidden, you are not ${username}`,
      });
    }
  }

  const data = {
    country: incomingCountry || "Add your country",
    streetName: incomingStreetName || "Add your street name",
    streetNumber: incomingStreetNumber || "Add your street number",
    flat: incomingFlat || "Add your flat",
    door: incomingDoor || "Add your door",
    postalCode: incomingPostalCode || "Add your zip code",
    city: incomingCity || "Add your city",
    mobilePhoneNumber: incomingMobilePhoneNumber || "Add your phone number",
  };

  const updatedAddress = await MyAddress.findByIdAndUpdate(
    retrievedAddress._id,
    data,
    { new: true }
  );

  if (!updatedAddress) {
    return res.status(500).json({
      status: "error",
      message: `Could not update ${username}'s address`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `${username}'s address updated successfully!!`,
    data: {
      address: updatedAddress,
    },
  });
});

exports.deleteMyAddress = tryCatch(async (req, res) => {
  const username = req.params.username;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }

  const requesterId = decodedToken.user._id;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      status: "error",
      message: `User ${username} not found`,
    });
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    if (requesterId !== user.toString()) {
      return res.status(403).json({
        status: "error",
        message: `Forbidden, you are not ${username}`,
      });
    }
  }

  const retrievedAddress = await MyAddress.findOne({ user });

  if (!retrievedAddress) {
    return res.status(404).json({
      status: "error",
      message: `No address found for user ${username}`,
    });
  }

  const addressId = retrievedAddress._id;

  const deletedAddress = await MyAddress.deleteOne({ _id: addressId });

  if (deletedAddress.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: `Something went wrong, could not delete address for user ${username}`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `Address deleted for user ${username}`,
  });
});
