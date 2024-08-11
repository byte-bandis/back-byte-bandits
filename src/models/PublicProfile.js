const mongoose = require("mongoose");
const { Schema } = mongoose;

const publicProfileSchema = Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    userPhoto: {
      type: String,
      required: false,
    },
    headerPhoto: {
      type: String,
      required: false,
    },
    userDescription: {
      type: String,
      required: false,
    },
  },
  { timestamps }
);

module.exports = mongoose.model("UserPublicProfile", publicProfileSchema);
