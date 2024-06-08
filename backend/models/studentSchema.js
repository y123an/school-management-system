const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  grandfathersName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  studentID: {
    type: Number,
    required: true,
    unique: true,
  },
  className: {
    type: String,
  },
  sclassName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sclass",
    required: true,
  },
  role: {
    type: String,
    default: "Student",
  },
  examResult: [
    {
      subName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subject",
        required: true,
      },
      results: [
        {
          title: {
            type: String,
            required: true,
          },
          marks: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  ],
  attendance: [
    {
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("student", studentSchema);
