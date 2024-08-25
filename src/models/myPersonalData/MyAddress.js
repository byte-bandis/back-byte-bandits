const mongoose = require("mongoose");
const { Schema } = mongoose;

const MyAddressSchema = Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    country: {
      type: String,
      index: true,
    },

    streetName: {
      type: String,
      index: true,
    },

    streetNumber: {
      type: String,
      index: true,
    },

    flat: {
      type: String,
      index: true,
    },

    door: {
      type: String,
      index: true,
    },

    postalCode: {
      type: String,
      index: true,
    },

    mobilePhoneNumber: {
      type: String,
      index: true,
      match: [
        /^\d{3}\s\d{3}\s\d{3}$/,
        "Please add a valid mobile phone number with format 123 123 123",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MyAddress", MyAddressSchema);
