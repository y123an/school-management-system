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
    const deletedStudents = await Student.deleteMany({
      sclassName: req.params.id,
    });
    const deletedSubjects = await Subject.deleteMany({
      sclassName: req.params.id,
    });
    const deletedTeachers = await Teacher.deleteMany({
      teachSclass: req.params.id,
    });
    res.send(deletedClass);
  } catch (error) {
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
    const deletedTeachers = await Teacher.deleteMany({ school: req.params.id });
    res.send(deletedClasses);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateHomeroomTeacher = async (req, res) => {
  try {
    const { teacherID } = req.body; // Get classId and teacherId from request body

    const classId = req.params.id;
    // Find the class by its ID
    const theClass = await Sclass.findById(classId);
    const teacher = await Teacher.findById(teacherID);

    if (!theClass) {
      return res.status(404).send("Class not found"); // Handle class not found error
    }

    if (!teacher) {
      return res.status(400).send("Teacher not found");
    }

    teacher.role = "HomeRoomTeacher"; // Update teacher's role

    await teacher.save();
    // Update the homeroomteacher reference
    theClass.homeroomteacher = teacherID;

    // Save the updated class document
    await theClass.save();

    // Respond with success message or updated class data
    return res.status(200).send("Homeroom teacher updated successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred during update"); // Handle internal server error
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
