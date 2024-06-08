const mongoose = require("mongoose");

const complainSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType", // Dynamic reference to either 'teacher' or 'parent'
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["teacher", "parent"],
  },
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Teacher", "Parent", , "HomeRoomTeacher"],
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  complaint: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("complain", complainSchema);
