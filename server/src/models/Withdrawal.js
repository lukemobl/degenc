const mongoose = require("mongoose");

const options = { timestamps: true };

const withdrawSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },

    recipient: {
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

const Withdraw = mongoose.model("withdraw", withdrawSchema);

module.exports = Withdraw;
