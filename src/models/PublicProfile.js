const mongoose = require("mongoose");
const { Schema } = mongoose;
const path = require("path");
const fs = require("fs");

const PublicProfileSchema = Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userPhoto: {
      type: String,
    },
    headerPhoto: {
      type: String,
    },
    userDescription: {
      type: String,
    },
    deleteUserPhoto: {
      type: Boolean,
    },
    deleteHeaderPhoto: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

PublicProfileSchema.methods.deleteUserPhotoIfRequested = async function ({
  deleteUserPhoto,
}) {
  try {
    if (deleteUserPhoto === "true" && this.userPhoto !== "UserTemplate.jpg") {
      const userPhotoPath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "profiles",
        this.userPhoto
      );
      if (fs.existsSync(userPhotoPath)) {
        await fs.promises.unlink(userPhotoPath);
        this.userPhoto = "UserTemplate.jpg";
      }
    }

    await this.save();
  } catch (error) {
    throw new Error("error_deleting_user_photo");
  }
};
PublicProfileSchema.methods.deleteHeaderPhotoIfRequested = async function ({
  deleteHeaderPhoto,
}) {
  try {
    console.log(
      "Esto es el deleteHeaderOhoto que llega al modelo: ",
      deleteHeaderPhoto,
      typeof deleteHeaderPhoto
    );
    if (deleteHeaderPhoto === "true" && this.headerPhoto !== "UserHeader.jpg") {
      const headerPhotoPath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "profiles",
        this.headerPhoto
      );
      if (fs.existsSync(headerPhotoPath)) {
        await fs.promises.unlink(headerPhotoPath);
        this.headerPhoto = "UserHeader.jpg"; // Reemplazar por default si se eliminó
      }
    }

    // Guardar cambios solo si se realizaron eliminaciones
    await this.save();
  } catch (error) {
    throw new Error("error_deleting_user_header");
  }
};

module.exports = mongoose.model("PublicProfile", PublicProfileSchema);
