const mongoose = require("mongoose");
const ReportSchema = new mongoose.Schema({
  reportedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reportingUsers: {
    type: [
      {
        _id: false,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reportMessage: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
  reportingDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
module.exports = mongoose.model("Report", ReportSchema);
