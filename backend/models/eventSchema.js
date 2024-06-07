// const eventSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     refPath: "userType",
//     required: true,
//   },
//   userType: {
//     type: String,
//     required: true,
//     enum: ["teacher", "parent", "admin", "superadmin"],
//   },
//   Subject: { type: String, required: true },
//   StartTime: { type: Date, required: true },
//   EndTime: { type: Date, required: true },
//   IsAllDay: { type: Boolean, default: false },
// });

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType",
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["teacher", "parent", "admin", "superadmin"],
  },
  Subject: String,
  StartTime: Date,
  EndTime: Date,
  IsAllDay: Boolean,
  Location: String,
  Description: String,
});

module.exports = mongoose.model("event", eventSchema);

const Event = mongoose.model("event", eventSchema);
