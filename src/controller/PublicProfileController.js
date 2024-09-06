const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PublicProfile = require("../models/PublicProfile");
const removePhotoFile = require("../utils/removePhotoFile");
const { tryCatch } = require("../utils/tryCatch");
const fs = require("fs").promises;
const path = require("node:path");

exports.createPublicProfile = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      state: "error",
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      state: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const { userDescription } = req.body;
  const username = req.params.username;

  const userPhoto = req.files["userPhoto"]
    ? req.files["userPhoto"][0].filename
    : "UserTemplate.jpg";
  const headerPhoto = req.files["headerPhoto"]
    ? req.files["headerPhoto"][0].filename
    : "UserHeader.jpg";

  const linkedUser = await User.findOne({ username });

  if (!linkedUser) {
    return res.status(404).json({
      state: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  const user = linkedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(401).json({
      state: "error",
      message: res.__("forbidden_not_owner", { username }),
    });
  }

  const newPublicProfile = await PublicProfile.create({
    user,
    username,
    userPhoto,
    headerPhoto,
    userDescription,
  });

  res.status(200).json({
    state: "success",
    data: newPublicProfile,
    message: res.__("public_profile_created", { username }),
  });
});

exports.getSinglePublicProfile = tryCatch(async (req, res) => {
  const username = req.params.username;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      state: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  let singlePublicProfile = await PublicProfile.findOne({
    user: retrievedUser._id,
  }).populate({
    path: "user",
    select: "username",
  });

  if (!singlePublicProfile) {
    return res.status(404).json({
      state: "error",
      message: res.__("profile_not_found", { username }),
    });
  }

  const imagesFolder = "public/images/profiles";
  singlePublicProfile = {
    ...singlePublicProfile._doc,
    userPhoto:
      process.env.NODE_ENV !== "production"
        ? `http://${req.headers.host}/${imagesFolder}/${singlePublicProfile.userPhoto}`
        : `https://${req.headers.host}/api/${imagesFolder}/${singlePublicProfile.userPhoto}`,
    headerPhoto:
      process.env.NODE_ENV !== "production"
        ? `http://${req.headers.host}/${imagesFolder}/${singlePublicProfile.headerPhoto}`
        : `https://${req.headers.host}/api/${imagesFolder}/${singlePublicProfile.headerPhoto}`,
  };

  res.status(200).json({
    state: "success",
    data: {
      profileId: singlePublicProfile._id,
      userPhoto: singlePublicProfile.userPhoto,
      userName: singlePublicProfile.user.username,
      headerPhoto: singlePublicProfile.headerPhoto,
      userDescription: singlePublicProfile.userDescription,
    },
    message: res.__("public_profile_loaded_successfully", { username }),
  });
});

exports.updatePublicProfile = tryCatch(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      state: "error",
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      state: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const incomingUserDescription = req.body.userDescription;

  const incomingUserPhoto = req.files["userPhoto"]
    ? req.files["userPhoto"][0].filename
    : "";
  const incomingHeaderPhoto = req.files["headerPhoto"]
    ? req.files["headerPhoto"][0].filename
    : "";

  const requestDeleteUserPhoto = req.body.deleteUserPhoto;
  const requestDeleteHeaderPhoto = req.body.deleteHeaderPhoto;

  console.log("Esto es requestDeleteUserPhoto: ", requestDeleteUserPhoto);
  console.log("Esto es requestDeleteHeaderPhoto: ", requestDeleteHeaderPhoto);

  const username = req.params.username;

  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      state: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  const retrievedProfile = await PublicProfile.findOne({
    user: retrievedUser._id,
  });

  if (!retrievedProfile) {
    return res.status(404).json({
      state: "error",
      message: res.__("profile_not_found", { username }),
    });
  }

  if (requesterId !== retrievedProfile.user.toString()) {
    return res.status(401).json({
      state: "error",
      message: res.__("forbidden_not_owner_profile"),
    });
  }

  console.log(
    "Esto son las fotos de retirevedProfile: ",
    retrievedProfile.userPhoto,
    "y",
    retrievedProfile.headerPhoto
  );

  try {
    // Se pasan las banderas deleteUserPhoto y deleteHeaderPhoto como parámetros a deletePhotos
    await retrievedProfile.deleteUserPhotoIfRequested({
      deleteUserPhoto: req.body.deleteUserPhoto,
    });
  } catch (error) {
    return res.status(500).json({
      state: "error",
      message: res.__("error_deleting_user_photo"),
    });
  }

  try {
    // Se pasan las banderas deleteUserPhoto y deleteHeaderPhoto como parámetros a deletePhotos
    await retrievedProfile.deleteHeaderPhotoIfRequested({
      deleteHeaderPhoto: req.body.deleteHeaderPhoto,
    });
  } catch (error) {
    return res.status(500).json({
      state: "error",
      message: res.__("error_deleting_user_header"),
    });
  }

  const data = {
    userPhoto:
      incomingUserPhoto || retrievedProfile.userPhoto || "UserTemplate.jpg",
    headerPhoto:
      incomingHeaderPhoto || retrievedProfile.headerPhoto || "UserHeader.jpg",

    userDescription:
      incomingUserDescription || res.__("user_description_empty"),
  };

  const updatedPublicProfile = await PublicProfile.findByIdAndUpdate(
    retrievedProfile._id,
    data,
    { new: true }
  );

  const cleanFileName = (fileName) => {
    const parts = fileName.split("-");
    const cleanedName = `${parts[0]}-${parts[2]}`;
    return cleanedName;
  };

  res.status(200).json({
    state: "success",
    data: updatedPublicProfile,
    assetUpdated: {
      userPhoto:
        updatedPublicProfile.userPhoto &&
        retrievedProfile.userPhoto !== updatedPublicProfile.userPhoto
          ? cleanFileName(updatedPublicProfile.userPhoto)
          : false,
      headerPhoto:
        updatedPublicProfile.headerPhoto &&
        retrievedProfile.headerPhoto !== updatedPublicProfile.headerPhoto
          ? cleanFileName(updatedPublicProfile.headerPhoto)
          : false,
      userDescription:
        updatedPublicProfile.userDescription &&
        retrievedProfile.userDescription !==
          updatedPublicProfile.userDescription
          ? updatedPublicProfile.userDescription
          : false,
    },
    message: {
      message: res.__("profile_updated_successfully", { username }),
      assetUpdated: {
        userPhoto:
          updatedPublicProfile.userPhoto &&
          retrievedProfile.userPhoto !== updatedPublicProfile.userPhoto
            ? cleanFileName(updatedPublicProfile.userPhoto)
            : false,
        headerPhoto:
          updatedPublicProfile.headerPhoto &&
          retrievedProfile.headerPhoto !== updatedPublicProfile.headerPhoto
            ? cleanFileName(updatedPublicProfile.headerPhoto)
            : false,
        userDescription:
          updatedPublicProfile.userDescription &&
          retrievedProfile.userDescription !==
            updatedPublicProfile.userDescription
            ? updatedPublicProfile.userDescription
            : false,
      },
    },
  });
});

exports.deletePublicProfile = tryCatch(async (req, res) => {
  const username = req.params.username;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      state: "error",
      message: res.__("no_token_provided"),
    });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      state: "error",
      message: res.__("invalid_token"),
    });
  }

  const requesterId = decodedToken.user._id;
  const retrievedUser = await User.findOne({ username });

  if (!retrievedUser) {
    return res.status(404).json({
      state: "error",
      message: res.__("user_not_found", { username }),
    });
  }

  const user = retrievedUser._id;

  if (requesterId !== user.toString()) {
    return res.status(403).json({
      state: "error",
      message: res.__("forbidden_not_owner_profile"),
    });
  }

  const retrievedProfile = await PublicProfile.findOne({ user });

  if (!retrievedProfile) {
    return res.status(404).json({
      state: "error",
      message: res.__("profile_not_found", { username }),
    });
  }

  try {
    if (
      retrievedProfile.userPhoto &&
      retrievedProfile.userPhoto !== "UserTemplate.jpg"
    ) {
      const userPhotoPath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "profiles",
        retrievedProfile.userPhoto
      );
      console.log(
        "Esto es el userphotopath que pretenfo borrar: ",
        userPhotoPath
      );

      await fs.unlink(userPhotoPath);
      console.log(
        res.__("image_deleted_successfully", { username, type: "imagen" })
      );
    }

    if (
      retrievedProfile.headerPhoto &&
      retrievedProfile.headerPhoto !== "UserHeader.jpg"
    ) {
      const headerPhotoPath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "profiles",
        retrievedProfile.headerPhoto
      );
      console.log(
        "Esto es el headerphotopath que pretenfo borrar: ",
        headerPhotoPath
      );
      await fs.unlink(headerPhotoPath);
      console.log(
        res.__("image_deleted_successfully", {
          username,
          type: "User header image",
        })
      );
    }
  } catch (error) {
    console.error(res.__("error_deleting_images", { error: error.message }));
  }

  await PublicProfile.deleteOne({ user });

  res.status(200).json({
    state: "success",
    message: res.__("public_profile_deleted", { username }),
  });
});
