const mongoose = require("mongoose");
const { Schema } = mongoose;

const MyCreditCardSchema = Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    creditCard: {
      type: String,
      required: true,
      index: true,
      match: [/^\d{13,18}$/, "Please, enter a valid card number"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MyCreditCard", MyCreditCardSchema);
