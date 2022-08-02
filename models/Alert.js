const mongoose = require("mongoose");

const AlertSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", AlertSchema);
