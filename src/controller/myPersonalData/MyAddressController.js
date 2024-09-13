const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { tryCatch } = require("../../utils/tryCatch");
const MyAddress = require("../../models/myPersonalData/MyAddress");

exports.createMyAddress = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("invalid_token"),
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
      message: res.__("user_not_found", { username }),
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message: res.__("forbidden_not_owner", { username }),
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
      message: res.__("error_creating_address", { username }),
    });
  }

  res.status(200).json({
    status: "success",
    message: res.__("new_address_created", { username }),
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
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const username = req.user.username;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      status: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      status: "error",
      message: res.__("forbidden_not_owner", { username }),
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
      message: res.__("no_address_found", { username }),
    });
  }

  res.status(200).json({
    status: "success",
    message: res.__("address_loaded_successfully", { username }),
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
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const { country, streetName, streetNumber, flat, door, postalCode, city } =
    req.body;
  const username = req.user.username;

  const linkedUser = await User.findOne({ _id: requesterId });

  if (!linkedUser) {
    return res.status(404).json({
      status: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  const user = linkedUser._id;
  const retrievedAddress = await MyAddress.findOne({
    user,
  });

  if (!retrievedAddress) {
    return res.status(404).json({
      status: "error",
      message: res.__("no_address_found", { username }),
    });
  }

  if (requesterId !== retrievedAddress.user.toString()) {
    if (requesterId !== user.toString()) {
      return res.status(403).json({
        status: "error",
        message: res.__("forbidden_not_owner", { username }),
      });
    }
  }

  const data = {
    country: country || "None",
    streetName: streetName || "--",
    streetNumber: streetNumber || "--",
    flat: flat || "--",
    door: door || "--",
    postalCode: postalCode || "--",
    city: city || "--",
  };

  const updatedAddress = await MyAddress.findByIdAndUpdate(
    retrievedAddress._id,
    data,
    { new: true }
  );

  if (!updatedAddress) {
    return res.status(500).json({
      status: "error",
      message: res.__("could_not_update_address", { username }),
    });
  }

  res.status(200).json({
    status: "success",
    message: res.__("address_updated_successfully", { username }),
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
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({
      status: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      status: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    if (requesterId !== user.toString()) {
      return res.status(403).json({
        status: "error",
        message: res.__("forbidden_not_owner", { username }),
      });
    }
  }

  const retrievedAddress = await MyAddress.findOne({ user });

  if (!retrievedAddress) {
    return res.status(404).json({
      status: "error",
      message: res.__("no_address_found", { username }),
    });
  }

  const addressId = retrievedAddress._id;
  const deletedAddress = await MyAddress.deleteOne({ _id: addressId });

  if (deletedAddress.deletedCount === 0) {
    return res.status(500).json({
      status: "error",
      message: res.__("something_went_wrong_delete_address", { username }),
    });
  }

  res.status(200).json({
    status: "success",
    message: res.__("address_deleted", { username }),
  });
});
