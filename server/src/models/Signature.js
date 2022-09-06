const mongoose = require("mongoose");

const options = { timestamps: true };

const signatureSchema = new mongoose.Schema(
  {
    signature: {
      type: String,
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

const Signature = mongoose.model("signature", signatureSchema);

module.exports = Signature;
