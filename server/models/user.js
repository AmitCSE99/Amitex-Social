const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      min: 3,
      max: 200,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    requests: {
      type: [
        {
          // user: {
          //   type: mongoose.Schema.Types.ObjectId,
          //   ref: "User",
          // },
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      default: "",
      max: 50,
    },
    city: {
      type: String,
      default: "",
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    notifications: {
      type: [
        {
          _id: false,
          messageType: {
            type: Number,
            default: 0,
          },
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
          },
          creationTime: {
            type: Date,
            default: Date.now(),
          },
          status: {
            type: Number,
            default: 0,
          },
          otherLikes: {
            type: Number,
            default: 0,
          },
          otherComments: {
            type: Number,
            default: 0,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
