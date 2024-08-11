const mongoose = require("mongoose");
const { Schema } = mongoose;

const PublicProfileSchema = Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      ref: "User",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("PublicProfile", PublicProfileSchema);
