const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  refresh_token: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("RefreshTokenTable", tokenSchema);
