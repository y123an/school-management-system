const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Subject = require("../models/subjectSchema.js");
const Teacher = require("../models/teacherSchema.js");

const sclassCreate = async (req, res) => {
  try {
    const { gradelevel, section } = req.body;

    const sclass = new Sclass({
      gradelevel,
      section,
    });

    const existingSclassByName = await Sclass.findOne({
      gradelevel,
      section,
      homeroomteacher: null,
    });

    if (existingSclassByName) {
      res.send({ message: "Sorry, this class already exists" });
    } else {
      const result = await sclass.save();
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const sclassList = async (req, res) => {
  try {
    let sclasses = await Sclass.find();
    if (sclasses.length > 0) {
      res.send(sclasses);
    } else {
      res.send({ message: "No sclasses found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSclassDetail = async (req, res) => {
  try {
    let sclass = await Sclass.findById(req.params.id).populate(
      "homeroomteacher",
      "name "
    );
    console.log(sclass);
    if (sclass) {
      res.send(sclass);
    } else {
      res.send({ message: "No class found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSclassStudents = async (req, res) => {
  try {
    let students = await Student.find({ sclassName: req.params.id });
    if (students.length > 0) {
      let modifiedStudents = students.map((student) => {
        return { ...student._doc, password: undefined };
      });
      res.send(modifiedStudents);
    } else {
      res.send({ message: "No students found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteSclass = async (req, res) => {
  try {
    const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.send({ message: "Class not found" });
    }

    // Delete related students and subjects
    await Student.deleteMany({ sclassName: req.params.id });
    await Subject.deleteMany({ sclassName: req.params.id });

    // Remove the deleted class from teachers' classes array
    const result = await Teacher.updateMany(
      { "classes.teachSclass": req.params.id },
      { $pull: { classes: { teachSclass: req.params.id } } }
    );

    res.send(deletedClass);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteSclasses = async (req, res) => {
  try {
    const deletedClasses = await Sclass.deleteMany({ school: req.params.id });
    if (deletedClasses.deletedCount === 0) {
      return res.send({ message: "No classes found to delete" });
    }
    const deletedStudents = await Student.deleteMany({ school: req.params.id });
    const deletedSubjects = await Subject.deleteMany({ school: req.params.id });

    res.send(deletedClasses);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateHomeroomTeacher = async (req, res) => {
  try {
    const { teacherID } = req.body;

    const classId = req.params.id;

    const theClass = await Sclass.findById(classId);
    const teacher = await Teacher.findById(teacherID);

    if (!theClass) {
      return res.status(404).send("Class not found");
    }

    if (!teacher) {
      return res.status(400).send("Teacher not found");
    }

    teacher.role = "HomeRoomTeacher";

    await teacher.save();

    theClass.homeroomteacher = teacherID;

    await theClass.save();

    return res
      .status(200)
      .send({ added: true, message: "Homeroom teacher updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred during update");
  }
};

module.exports = {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents,
  updateHomeroomTeacher,
};
