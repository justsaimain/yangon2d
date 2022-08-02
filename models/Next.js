const mongoose = require("mongoose");

const nextSchema = new mongoose.Schema(
  {
    sell: {
      type: String,
      required: true,
    },
    buy: {
      type: String,
      required: true,
    },
    show_date_time: {
      type: String,
      required: true,
    },
    delete_date_time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Next", nextSchema);
