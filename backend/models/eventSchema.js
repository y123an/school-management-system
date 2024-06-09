const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  Subject: String,
  StartTime: Date,
  EndTime: Date,
  IsAllDay: Boolean,
  Location: String,
  Description: String,
});

module.exports = mongoose.model("event", eventSchema);

const Event = mongoose.model("event", eventSchema);
