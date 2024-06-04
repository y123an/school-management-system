const mongoose = require("mongoose");

const parentsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  Children: [
    { child: { type: mongoose.Schema.Types.ObjectId, ref: "student" } },
  ],
  role: {
    type: String,
    default: "Parent",
  },
});

module.exports = mongoose.model("parent", parentsSchema);
