const Teacher = require("../models/teacherSchema");
const Student = require("../models/studentSchema");
const Parent = require("../models/parentSchema");
const SClass = require("../models/sclassSchema");

// Controller to get teacher-student ratio
const getTeacherStudentRatio = async (req, res) => {
  try {
    const teachers = await Teacher.find({}).populate("classes.teachSclass");
    const students = await Student.find({}).populate("sclassName");

    const classData = {};

    teachers.forEach((teacher) => {
      teacher.classes.forEach((c) => {
        if (!classData[c.teachSclass._id]) {
          classData[c.teachSclass._id] = { teacherCount: 0, studentCount: 0 };
        }
        classData[c.teachSclass._id].teacherCount += 1;
      });
    });

    students.forEach((student) => {
      if (classData[student.sclassName._id]) {
        classData[student.sclassName._id].studentCount += 1;
      }
    });

    const chartData = [];

    for (const classId of Object.keys(classData)) {
      const classInfo = await SClass.findById(classId);
      if (classInfo) {
        const className = `${classInfo.gradelevel}-${classInfo.section}`;
        chartData.push({
          className: className,
          teacherCount: classData[classId].teacherCount,
          studentCount: classData[classId].studentCount,
          ratio:
            classData[classId].studentCount / classData[classId].teacherCount,
        });
      }
    }

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get gender distribution for students
const getStudentGenderDistribution = async (req, res) => {
  try {
    // Fetch students data
    const students = await Student.find({});

    // Initialize gender data object with counts for Male and Female
    const genderData = {
      male: 0,
      female: 0,
    };

    // Count gender distribution for students
    students.forEach((student) => {
      genderData[student.gender.toLowerCase()] += 1;
    });

    // Send response with gender distribution data
    res.json(genderData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get exam results
const getExamResults = async (req, res) => {
  try {
    const students = await Student.find({}).populate("examResult.subName");

    const subjectData = {};

    students.forEach((student) => {
      student.examResult.forEach((result) => {
        if (!subjectData[result.subName.subName]) {
          subjectData[result.subName.subName] = {
            totalMarks: 0,
            count: 0,
          };
        }
        result.results.forEach((r) => {
          subjectData[result.subName.subName].totalMarks += r.marks;
          subjectData[result.subName.subName].count += 1;
        });
      });
    });

    const chartData = Object.keys(subjectData).map((subject) => ({
      subject,
      averageMarks:
        subjectData[subject].totalMarks / subjectData[subject].count,
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get parent involvement
const getParentInvolvement = async (req, res) => {
  try {
    const parents = await Parent.find({}).populate("Children.child");

    const chartData = parents.map((parent) => ({
      parentName: parent.name,
      childrenCount: parent.Children.length,
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get class distribution
const getClassDistribution = async (req, res) => {
  try {
    const students = await Student.find({}).populate(
      "sclassName",
      "gradelevel section"
    );

    const classData = {};

    students.forEach((student) => {
      if (
        !classData[
          student.sclassName.gradelevel + "" + student.sclassName.section
        ]
      ) {
        classData[
          student.sclassName.gradelevel + " " + student.sclassName.section
        ] = 0;
      }
      classData[
        student.sclassName.gradelevel + " " + student.sclassName.section
      ] += 1;
    });

    const chartData = Object.keys(classData).map((className) => ({
      className,
      studentCount: classData[className],
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeacherStudentRatio,
  // getGenderDistribution,
  getExamResults,
  getParentInvolvement,
  getClassDistribution,
  getStudentGenderDistribution,
};
