const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Teacher", "HomeRoomTeacher"],
    },
    classes: [
      {
        teachSclass: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "sclass",
          required: true,
        },
        teachSubject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "subject",
        },
      },
    ],
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        presentCount: {
          type: String,
        },
        absentCount: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("teacher", teacherSchema);
