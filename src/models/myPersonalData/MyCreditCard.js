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
      index: true,
      match: [/^\d{13,18}$/, "Please, enter a valid card number"],
    },
  },
  { timestamps: true }
);

MyCreditCardSchema.methods.formatCreditCard = function () {
  return this.creditCard.replace(/(.{4})/g, "$1 ").trim();
};

module.exports = mongoose.model("MyCreditCard", MyCreditCardSchema);
