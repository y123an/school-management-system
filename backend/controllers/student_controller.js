const bcrypt = require("bcrypt");
const Student = require("../models/studentSchema.js");
const Subject = require("../models/subjectSchema.js");

const studentRegister = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      grandfathersName,
      studentID,
      sclassName,
      gender,
      className,
    } = req.body;

    const existingStudent = await Student.findOne({
      studentID,
      sclassName,
    });

    if (existingStudent) {
      return res.send({ message: "Roll Number already exists" });
    }

    const student = new Student({
      firstName,
      lastName,
      grandfathersName,
      studentID,
      sclassName,
      gender,
      className,
      role: "Student", // Assuming you always want to set the role as "Student"
    });

    const result = await student.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getStudents = async (req, res) => {
  try {
    let students = await Student.find().populate(
      "sclassName",
      "sclassName  gradelevel section"
    );
    if (students.length > 0) {
      let modifiedStudents = students.map((student) => {
        return { ...student._doc };
      });
      res.send(modifiedStudents);
    } else {
      res.send({ message: "No students found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getStudentDetail = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id)
      .populate("sclassName", "sclassName gradelevel section")
      .populate("examResult.subName", "subName results")
      .populate({
        path: "attendance",
        select: "date status",
        populate: { path: "subName", select: "subName sessions" },
      });

    if (student) {
      student.password = undefined;
      res.send(student);
    } else {
      res.send({ message: "No student found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).json(err);
  }
};

const deleteStudents = async (req, res) => {
  try {
    const result = await Student.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No students found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(err);
  }
};

const deleteStudentsByClass = async (req, res) => {
  try {
    const result = await Student.deleteMany({ sclassName: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No students found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(err);
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      grandfathersName,
      gender,
      studentID,
      sclassName,
      className,
    } = req.body;

    // Find the student by ID
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Update only the specified fields
    student.firstName = firstName || student.firstName;
    student.lastName = lastName || student.lastName;
    student.grandfathersName = grandfathersName || student.grandfathersName;
    student.gender = gender || student.gender;
    student.studentID = studentID || student.studentID;
    student.sclassName = sclassName || student.sclassName;
    student.className = className || student.className;

    // Save the updated student
    const updatedStudent = await student.save();

    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateExamResult = async (req, res) => {
  const { subName, results } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.send({ message: "Student not found" });
    }

    let existingResult = student.examResult.find(
      (result) => result.subName.toString() === subName
    );

    if (existingResult) {
      // Create a map of existing results by title
      const existingResultsMap = new Map(
        existingResult.results.map((result) => [result.title, result])
      );

      // Update or add new results to the map
      for (const newResult of results) {
        existingResultsMap.set(newResult.title, newResult);
      }

      // Convert the map back to an array
      existingResult.results = Array.from(existingResultsMap.values());
    } else {
      // Add new result
      existingResult = { subName, results };
      student.examResult.push(existingResult);
    }

    const savedStudent = await student.save();
    res.send(savedStudent);
  } catch (error) {
    res.status(500).json(error);
  }
};

const studentAttendance = async (req, res) => {
  const { status, date } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.send({ message: "Student not found" });
    }

    const existingAttendance = student.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      student.attendance.push({ date, status });
    }

    const result = await student.save();
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
  const subName = req.params.id;

  try {
    const result = await Student.updateMany(
      { "attendance.subName": subName },
      { $pull: { attendance: { subName } } }
    );
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const clearAllStudentsAttendance = async (req, res) => {
  const schoolId = req.params.id;

  try {
    const result = await Student.updateMany(
      { school: schoolId },
      { $set: { attendance: [] } }
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const removeStudentAttendanceBySubject = async (req, res) => {
  const studentId = req.params.id;
  const subName = req.body.subId;

  try {
    const result = await Student.updateOne(
      { _id: studentId },
      { $pull: { attendance: { subName: subName } } }
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const removeStudentAttendance = async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await Student.updateOne(
      { _id: studentId },
      { $set: { attendance: [] } }
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  studentRegister,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  studentAttendance,
  deleteStudentsByClass,
  updateExamResult,

  clearAllStudentsAttendanceBySubject,
  clearAllStudentsAttendance,
  removeStudentAttendanceBySubject,
  removeStudentAttendance,
};
