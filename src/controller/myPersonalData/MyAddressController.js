const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { tryCatch } = require("../../utils/tryCatch");
const MyAddress = require("../../models/myPersonalData/MyAddress");
const {
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} = require("../../middleware/errors");

exports.createMyAddress = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
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
      message: `User ${username} not found`,
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(401).json({
      message: `Forbidden, you are not ${username}`,
    });
  }

  try {
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

    res.status(200).json({
      status: "success",
      message: `New address created for user ${username}!`,
      data: {
        address: newAddress,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `Error creating address for user ${username}!`,
    });
  }
});

exports.getMyAddress = tryCatch(async (req, res) => {
  const username = req.params.username;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      message: `User ${username} not found`,
    });
  }

  const myAddress = await MyAddress.findOne({
    user: retrievedUser._id,
  }).populate({
    path: "user",
    select: "username",
  });

  if (!myAddress) {
    return res.status(404).json({
      message: `Address not found for user ${username}`,
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
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const requesterId = decodedToken.user._id;
  const incomingCountry = req.body.country;
  const incomingStreetName = req.body.streetName;
  const incomingStreetNumber = req.body.streetNumber;
  const incomingFlat = req.body.flat;
  const incomingDoor = req.body.door;
  const incomingPostalCode = req.body.postalCode;
  const incomingMobilePhoneNumber = req.body.mobilePhoneNumber;

  const username = req.params.username;

  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      message: `User ${username} not found`,
    });
  }

  const retrievedAddress = await MyAddress.findOne({
    user: retrievedUser._id,
  });

  console.log("Esto es retirevedAddress: ", retrievedAddress);

  if (!retrievedAddress) {
    return res.status(404).json({
      message: `Address not found for ${username}`,
    });
  }

  if (requesterId !== retrievedAddress.user.toString()) {
    return res.status(401).json({
      message: "Forbidden, you are not the owner of this address",
    });
  }

  const data = {
    country: incomingCountry,
    streetName: incomingStreetName,
    streetNumber: incomingStreetNumber,
    flat: incomingFlat,
    door: incomingDoor,
    postalCode: incomingPostalCode,
    mobilePhoneNumber: incomingMobilePhoneNumber,
  };

  const updatedAddress = await MyAddress.findByIdAndUpdate(
    retrievedAddress._id,
    data,
    { new: true }
  );

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
    throw new UnauthorizedError("Authorization token is missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const requesterId = decodedToken.user._id;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    throw new NotFoundError(`User ${username} not found`);
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    throw new ForbiddenError(
      "Forbidden, you are not the owner of this address"
    );
  }

  const retrievedAddress = await MyAddress.findOne({ user });

  if (!retrievedAddress) {
    throw new NotFoundError(`User ${username} doesn't have an address`);
  }

  const addressId = retrievedAddress._id;

  await MyAddress.deleteOne({ _id: addressId });

  res.status(200).json({
    status: "success",
    message: `Address deleted for user ${username}`,
  });
});
