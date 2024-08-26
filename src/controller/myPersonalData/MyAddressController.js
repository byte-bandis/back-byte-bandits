const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { tryCatch } = require("../../utils/tryCatch");
const MyAddress = require("../../models/myPersonalData/MyAddress");
const {
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
  ServerError,
} = require("../../middleware/errors");

exports.createMyAddress = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    throw new UnauthorizedError("Invalid token");
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
    throw new NotFoundError(`User ${username} not found`);
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    throw new ForbiddenError(`Forbidden, you are not ${username}`);
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
    throw new ServerError(`Error creating address for user ${username}`);
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
  const username = req.params.username;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    throw new NotFoundError(`User ${username} not found`);
  }

  const myAddress = await MyAddress.findOne({
    user: retrievedUser._id,
  }).populate({
    path: "user",
    select: "username",
  });

  if (!myAddress) {
    throw new NotFoundError(`Address not found for user ${username}`);
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
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    throw new UnauthorizedError("Invalid token");
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

  const username = req.params.username;

  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    throw new NotFoundError(`User ${username} not found`);
  }

  const retrievedAddress = await MyAddress.findOne({
    user: retrievedUser._id,
  });

  if (!retrievedAddress) {
    throw new NotFoundError(`Address not found for ${username}`);
  }

  if (requesterId !== retrievedAddress.user.toString()) {
    throw new ForbiddenError(
      "Forbidden, you are not the owner of this address"
    );
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
    throw new ServerError(`Could not update ${username}'s address`);
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

  const deletedAddress = await MyAddress.deleteOne({ _id: addressId });

  if (deletedAddress.deletedCount === 0) {
    throw new ServerError(
      `Something went wrong, could not delete address for user ${username}`
    );
  }

  res.status(200).json({
    status: "success",
    message: `Address deleted for user ${username}`,
  });
});
