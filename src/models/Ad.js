const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdSchema = Schema(
  {
    adTitle: {
      type: String,
      required: [true, "Please add post title"],
    },
    adBody: {
      type: String,
      required: [true, "Please add post body"],
    },
    sell: {
      type: Boolean,
      required: true,
      index: true,
      default: false,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    photo: {
      type: String,
    },
    tags: {
      type: [String],
      required: true,
      enum: {
        values: ["accessories", "fashion", "decoration", "arts", "others"],
      },
      default: "others",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add author id"],
    },
    reserverBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [false, "Please add reserver id"],
    },
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [false, "Please add buyer id"],
    },
    duration: {
      type: Number,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

AdSchema.index({ adTitle: "text" });

AdSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "ad",
});

module.exports = mongoose.model("Ad", AdSchema);
