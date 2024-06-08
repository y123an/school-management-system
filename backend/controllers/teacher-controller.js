const bcrypt = require("bcrypt");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const Sclass = require("../models/sclassSchema.js");
const jwt = require("jsonwebtoken");

const teacherRegister = async (req, res) => {
  const { name, email, password, role, classes, gender, phone } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const existingTeacherByEmail = await Teacher.findOne({ email });
    if (existingTeacherByEmail) {
      return res.send({ message: "Email already exists" });
    }

    // Check if any class is already assigned to another teacher
    for (const cls of classes) {
      const existingTeacherWithClass = await Teacher.findOne({
        "classes.teachSclass": cls.teachSclass,
        "classes.teachSubject": cls.teachSubject,
      });

      if (existingTeacherWithClass) {
        return res.send({
          message: `Class with and Subject is already assigned to another teacher`,
        });
      }
    }

    const teacher = new Teacher({
      name,
      email,
      password: hashedPass,
      role,
      gender,
      phone,
      classes,
    });

    let result = await teacher.save();

    // Update the Subject and Sclass collections
    for (const cls of classes) {
      if (cls.teachSubject) {
        await Subject.findByIdAndUpdate(cls.teachSubject, {
          $addToSet: { teachers: teacher._id },
        });
      }

      await Sclass.findByIdAndUpdate(cls.teachSclass, {
        $addToSet: { teachers: teacher._id },
      });
    }

    result.password = undefined;
    res.send(result);
  } catch (err) {
    console.error("Error registering teacher:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const teacherLogIn = async (req, res) => {
  try {
    let teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) {
      const validated = await bcrypt.compare(
        req.body.password,
        teacher.password
      );
      if (validated) {
        teacher = await teacher.populate(
          "classes.teachSubject",
          "subName sessions"
        );
        teacher = await teacher.populate(
          "classes.teachSclass",
          "sclassName gradelevel section"
        );

        const payload = {
          email: teacher.email,
          role: "Teacher",
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        teacher.password = undefined; // Remove the password field before sending the response

        // Send the token along with the teacher details
        res.send({ user: teacher, token });
      } else {
        res.status(401).send({ message: "Invalid password" });
      }
    } else {
      res.status(404).send({ message: "Teacher not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate({
        path: "classes.teachSubject",
        select: "subName",
      })
      .populate("classes.teachSclass", "gradelevel section");

    if (teachers.length > 0) {
      const modifiedTeachers = teachers.map((teacher) => {
        return {
          ...teacher._doc,
          password: undefined,
        };
      });

      res.send(modifiedTeachers);
    } else {
      res.send({ message: "No teachers found" });
    }
  } catch (err) {
    console.error("Error getting teachers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTeacherDetail = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate({ path: "classes.teachSubject", select: "subName sessions" })
      .populate({
        path: "classes.teachSclass",
        select: "sclassName gradelevel section",
      });

    if (teacher) {
      const modifiedClasses = teacher.classes.map((cls) => ({
        teachSubject: {
          subName: cls.teachSubject.subName,
          _id: cls.teachSubject._id,
        },
        teachSclass: {
          gradelevel: cls.teachSclass.gradelevel,
          section: cls.teachSclass.section,
          _id: cls.teachSclass._id,
        },
      }));

      const modifiedTeacher = {
        ...teacher._doc,
        password: undefined,
        classes: modifiedClasses,
      };

      res.send(modifiedTeacher);
    } else {
      res.send({ message: "No teacher found" });
    }
  } catch (err) {
    console.error("Error getting teacher detail:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTeacherSubject = async (req, res) => {
  const { teacherId, teachSubject } = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { teachSubject },
      { new: true }
    );

    await Subject.findByIdAndUpdate(teachSubject, {
      teacher: updatedTeacher._id,
    });

    res.send(updatedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    await Subject.updateOne(
      { teacher: deletedTeacher._id, teacher: { $exists: true } },
      { $unset: { teacher: 1 } }
    );

    res.send(deletedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTeachers = async (req, res) => {
  try {
    const deletionResult = await Teacher.deleteMany();

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No teachers found to delete" });
      return;
    }

    const deletedTeachers = await Teacher.find({ school: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "" }, $unset: { teacher: null } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTeachersByClass = async (req, res) => {
  try {
    const deletionResult = await Teacher.deleteMany({
      sclassName: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No teachers found to delete" });
      return;
    }

    const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "" }, $unset: { teacher: null } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const teacherAttendance = async (req, res) => {
  const { status, date } = req.body;

  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.send({ message: "Teacher not found" });
    }

    const existingAttendance = teacher.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      teacher.attendance.push({ date, status });
    }

    const result = await teacher.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addClassToTeacher = async (req, res) => {
  try {
    const { teachSclass, teachSubject } = req.body.classes[0];
    const teacherId = req.params.id;

    // Check if teachSclass is provided
    if (!teachSclass) {
      return res.json({ message: "teachSclass is required" });
    }

    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status.json({ message: "Teacher not found" });
    }

    // Check if the class already exists in teacher's classes array
    const existingClass = teacher.classes.find(
      (cls) =>
        cls.teachSclass.toString() === teachSclass &&
        cls.teachSubject?.toString() === teachSubject?.toString()
    );
    if (existingClass) {
      return res.json({ message: "Class already exists for the teacher" });
    }

    // Add the class to the teacher's classes array
    teacher.classes.push({ teachSclass, teachSubject });
    await teacher.save();

    // Update the Subject and Sclass collections
    if (teachSubject) {
      await Subject.findByIdAndUpdate(teachSubject, {
        $addToSet: { teachers: teacher._id },
      });
    }

    await Sclass.findByIdAndUpdate(teachSclass, {
      $addToSet: { teachers: teacher._id },
    });

    res.json({
      add: true,
      message: "Class added successfully for the teacher",
    });
  } catch (error) {
    console.error("Error adding class to teacher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTeachersByClassId = async (req, res) => {
  try {
    const classId = req.params.id; // Get the class ID from the request parameters

    // Find all teachers who teach the specified class
    const teachers = await Teacher.find({
      "classes.teachSclass": classId,
    }).populate("classes.teachSubject", "subject");

    if (!teachers || teachers.length === 0) {
      return res.send({ message: "No teachers found for the specified class" });
    }

    return res.status(200).send(teachers);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while fetching teachers");
  }
};
const removeClassFromTeacher = async (req, res) => {
  try {
    const { teacherID, classID } = req.params; // Get teacher ID and class ID from request parameters

    // Find the teacher by their ID
    const teacher = await Teacher.findById(teacherID);

    if (!teacher) {
      return res.status(404).send("Teacher not found"); // Handle teacher not found error
    }

    // Filter out the class to be removed
    teacher.classes = teacher.classes.filter(
      (cls) => cls.teachSclass.toString() !== classID
    );

    // Save the updated teacher document
    await teacher.save();

    // Respond with success message
    return res.status(200).send({
      removed: true,
      message: "Class removed from teacher successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while removing the class"); // Handle internal server error
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone, gender } = req.body;

    // Find the teacher by ID
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Update only the specified fields
    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      teacher.password = await bcrypt.hash(password, salt);
    }
    if (phone) teacher.phone = phone;
    if (gender) teacher.gender = gender;

    // Save the updated teacher
    const updatedTeacher = await teacher.save();

    // Hide the password in the response
    updatedTeacher.password = undefined;

    res.json(updatedTeacher);
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacher,
  updateTeacherSubject,
  deleteTeacher,
  deleteTeachers,
  deleteTeachersByClass,
  teacherAttendance,
  addClassToTeacher,
  getTeachersByClassId,
  removeClassFromTeacher,
};
