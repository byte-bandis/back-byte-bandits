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
      required: true,
      index: true,
    },

    streetName: {
      type: String,
      required: true,
      index: true,
    },

    streetNumber: {
      type: String,
      required: true,
      index: true,
    },

    flat: {
      type: String,
      required: true,
      index: true,
    },

    door: {
      type: String,
      required: true,
      index: true,
    },

    postalCode: {
      type: String,
      required: true,
      index: true,
    },

    mobilePhoneNumber: {
      type: String,
      required: true,
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
