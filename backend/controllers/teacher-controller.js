const bcrypt = require("bcrypt");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const Sclass = require("../models/sclassSchema.js");

const teacherRegister = async (req, res) => {
  const { name, email, password, role, school, classes } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPass,
      role,
      school,
      classes,
    });

    const existingTeacherByEmail = await Teacher.findOne({ email });

    if (existingTeacherByEmail) {
      return res.send({ message: "Email already exists" });
    }

    let result = await teacher.save();

    // Update all subjects and classes to reference the new teacher
    for (const cls of classes) {
      // Update subject reference
      if (cls.teachSubject) {
        await Subject.findByIdAndUpdate(cls.teachSubject, {
          $addToSet: { teachers: teacher._id },
        });
      }

      // Update class reference
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
        teacher = await teacher.populate("teachSubject", "subName sessions");
        teacher = await teacher.populate("school", "schoolName");
        teacher = await teacher.populate("teachSclass", "sclassName");
        teacher.password = undefined;
        res.send(teacher);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "Teacher not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ school: req.params.id })
      .populate({
        path: "classes.teachSubject",
        select: "subName",
      })
      .populate("classes.teachSclass", "gradelevel section");

    if (teachers.length > 0) {
      const modifiedTeachers = teachers.map((teacher) => {
        const modifiedClasses = teacher.classes.map((cls) => ({
          teachSubject: {
            sunName: cls.teachSubject.subName,
            _id: cls.teachSubject._id,
          },
          teachSclass: {
            gradelevel: cls.teachSclass.gradelevel,
            section: cls.teachSclass.section,
            _id: cls.teachSclass._id,
          },
        }));

        return {
          ...teacher._doc,
          password: undefined,
          classes: modifiedClasses,
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
      .populate({ path: "school", select: "schoolName" })
      .populate({ path: "classes.teachSclass", select: "sclassName" });

    if (teacher) {
      const modifiedClasses = teacher.classes.map((cls) => ({
        teachSubject: {
          sunName: cls.teachSubject.subName,
          _id: cls.teachSubject._id,
        },
        teachSclass: {
          sclassName: cls.teachSclass.sclassName,
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
    const deletionResult = await Teacher.deleteMany({ school: req.params.id });

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
      return res.status(400).json({ error: "teachSclass is required" });
    }

    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Check if the class already exists in teacher's classes array
    const existingClass = teacher.classes.find(
      (cls) =>
        (cls.teachSclass.toString() === teachSclass) &
        (cls.teachSubject.toString() === teachSubject)
    );
    if (existingClass) {
      return res
        .status(400)
        .json({ error: "Class already exists for the teacher" });
    }

    // Add the class to the teacher's classes array
    teacher.classes.push({ teachSclass, teachSubject });
    await teacher.save();

    res
      .status(200)
      .json({ message: "Class added successfully for the teacher" });
  } catch (error) {
    console.error("Error adding class to teacher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacherSubject,
  deleteTeacher,
  deleteTeachers,
  deleteTeachersByClass,
  teacherAttendance,
  addClassToTeacher,
};
