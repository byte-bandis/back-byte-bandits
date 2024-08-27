const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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

    last4Digits: {
      type: String,
    },
  },
  { timestamps: true }
);

MyCreditCardSchema.pre("save", async function (next) {
  const creditCard = this.creditCard;

  if (!this.isModified("creditCard")) {
    return next();
  }

  const isHashed = /^\$2[ayb]\$.{56}$/.test(this.creditCard);
  if (isHashed) {
    return next();
  }

  this.last4Digits = this.creditCard.slice(-4);

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedCreditCard = await bcrypt.hash(creditCard, salt);
    this.creditCard = hashedCreditCard;
    next();
  } catch (error) {
    next(error);
  }
});

MyCreditCardSchema.methods.compareCreditCard = async function (
  enteredCreditCard
) {
  return await bcrypt.compare(enteredCreditCard, this.creditCard);
};

MyCreditCardSchema.methods.formatCreditCard = function () {
  if (!this.last4Digits) {
    throw new Error("Last 4 digits of the credit card are not available.");
  }

  return `**** **** **** ${this.last4Digits}`;
};

module.exports = mongoose.model("MyCreditCard", MyCreditCardSchema);
