const mongoose = require("mongoose");

const CloseDaySchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CloseDays", CloseDaySchema);
