const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { validate } = require("../User");
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
      required: true,
      minlength: [13, "Credit card number must be at least 13 digits"],
      maxlength: [18, "Credit card number cannot exceed 18 digits"],
      validate: {
        validator: function (val) {
          return /^\d+$/.test(val);
        },
        message: "Credit card number must only contain digits",
      },
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
    return "Enter your credit card number";
  }

  return `****${this.last4Digits}`;
};

module.exports = mongoose.model("MyCreditCard", MyCreditCardSchema);
