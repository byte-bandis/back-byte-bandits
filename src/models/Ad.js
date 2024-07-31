const mongoose = require('mongoose');
const {Schema} = mongoose;

const AdSchema = Schema(
  {
    adTitle: {
      type: String,
      required: [true, 'Please add post title']
    },
    adBody: {
      type: String,
      required: [true, 'Please add post body']
    },
    sell: {
      type: Boolean,
      required: true,
      index: true,
      default: false
    },
    price: {
      type: Number,
      required: true,
      index: true
    },
    photo: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: true,
      enum: {
        values: ['lifestyle', 'mobile', 'motor', 'work', 'others'],
      },
      default: 'others'
    },
    owner:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);



AdSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'ad'
});

module.exports = mongoose.model('Ad', AdSchema);
