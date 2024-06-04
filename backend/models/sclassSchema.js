const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema(
  {
    gradelevel: {
      type: Number,
    },
    section: {
      type: String,
    },
    homeroomteacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sclass", sclassSchema);
