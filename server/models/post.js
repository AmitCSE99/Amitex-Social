const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: [
        {
          _id: false,
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    comments: {
      type: [
        {
          _id: false,
          comment: {
            type: String,
          },
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          creationTime: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
      default: [],
    },
    bookMarkedBy: {
      type: Array,
      default: [],
    },
    public_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
