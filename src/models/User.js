const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Schema} = mongoose;

const AddressSchema = new Schema({
    country: {
      type: String,
      required: [true, "Please add a country"]
    },
    nameAndLastName: {
      type: String,
      required: [true, "Please add your name and last name"]
    },
    streetAndNumber:{
      type: String,
      required: [true, "Add street name and number"]
    },
    flatAndDoor:{
      type: String,
      required: [true, "Add flat and Door"]
    },
    postalCode:{
      type: Number,
      required: [true, "Add a postal code"]
    },
    mobilePhoneNumber:{
      type: Number,
      required:[true, "Add a phone number. Example 123 123 123"],
      match:[/^\d{3}\s\d{3}\s\d{3}$/, "Please ad a valid mobile phone number with format 123 123 123"]
    },
  }
)

const WhishlistSchema = new Schema({
  product:{
    type: Schema.Types.ObjectId,
    ref: "Ad",
    required: true,
  }
})

const PurchaseSchema = new Schema({
  product:{
    type: Schema.Types.ObjectId,
    ref: "Ad",
    required: true
  },
  sale:{
    type: Boolean,
  }
})

const SaleSchema =new Schema({
  product:{
    type: Schema.Types.ObjectId,
    ref: "Ad",
    required: true,
  }
})

const ReservedSchema = new Schema({
  product:{
    type: Schema.Types.ObjectId,
    ref: "Ad",
    required: true,
  }
})

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [/^\S+@\S+$/, 'Please add a valid email']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    birthdate: {
      type: Date,
      required: [true, 'Please add your birthdate'],
    },
    address: {
      type: AddressSchema,
    },
    creditCard: {
      type: String,
    },
    whishList: [WhishlistSchema],
    purchases: [PurchaseSchema],
    sales: [SaleSchema],
    reserved:  [ReservedSchema],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwt = function () {
  return jwt.sign({ user: this }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

UserSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user'
});

UserSchema.virtual('post', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'post'
});

module.exports = mongoose.model('User', UserSchema); 
