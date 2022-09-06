const mongoose = require("mongoose");

const options = { timestamps: true };

const depositSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    signature: {
      type: String,
      required: true,
    },

    complete: {
      type: Boolean,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    uuid: {
      type: String,
      required: true,
      unique: true,
    },
  },
  options
);

const Deposit = mongoose.model("deposit", depositSchema);

module.exports = Deposit;
