const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
    },
    name: {
      type: String,
      index: true,
    },
    lastname: {
      type: String,
      index: true,
    },
    mobilePhoneNumber: {
      type: String,
      index: true,
      /*       match: [
        /^\d{3}\s\d{3}\s\d{3}$/,
        "Please add a valid mobile phone number with format 123 123 123",
      ], */
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [/^\S+@\S+$/, "Please add a valid email"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    birthdate: {
      type: Date,
      required: [true, "Please add your birthdate"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const password = this.password;

  if (!this.isModified("password")) {
    return next();
  }
  const isHashed = /^\$2[ayb]\$.{56}$/.test(this.password);
  if (isHashed) {
    return next();
  }

  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      this.password = hashedPassword;
      next();
    }
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwt = function () {
  return jwt.sign({ user: this }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
});

UserSchema.virtual("post", {
  ref: "Post",
  localField: "_id",
  foreignField: "post",
});

UserSchema.virtual("publicProfile", {
  ref: "PublicProfile",
  localField: "_id",
  foreignField: "publicProfile",
});

UserSchema.virtual("myAddress", {
  ref: "MyAddress",
  localField: "_id",
  foreignField: "myAddress",
});

UserSchema.virtual("myCreditCard", {
  ref: "MyCreditCard",
  localField: "_id",
  foreignField: "myCreditCard",
});

module.exports = mongoose.model("User", UserSchema);
