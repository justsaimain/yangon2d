const mongoose = require("mongoose");

const ResultSchema = mongoose.Schema(
  {
    buy: {
      type: String,
      required: true,
    },
    sell: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
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

module.exports = mongoose.model("Results", ResultSchema);
