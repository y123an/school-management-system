const router = require("express").Router();

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const {
  adminRegister,
  adminLogIn,
  getAdminDetail,
  getAdmins,
  deleteAdmin,
  updateAdmin,
} = require("../controllers/admin-controller.js");

const {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents,
  updateHomeroomTeacher,
} = require("../controllers/class-controller.js");

const {
  complainCreate,
  complainList,
  deleteComplaint,
} = require("../controllers/complain-controller.js");
const {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController.js");
const {
  noticeCreate,
  noticeList,
  deleteNotices,
  deleteNotice,
  updateNotice,
} = require("../controllers/notice-controller.js");
const {
  registerParent,
  parentLogIn,
  getParentById,
  getAllParents,
  deleteParent,
  updateParent,
} = require("../controllers/parent-controller.js");
const {
  studentRegister,
  studentLogIn,
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
} = require("../controllers/student_controller.js");
const {
  subjectCreate,
  classSubjects,
  deleteSubjectsByClass,
  getSubjectDetail,
  deleteSubject,
  freeSubjectList,
  allSubjects,
  deleteSubjects,
  updateSubject,
} = require("../controllers/subject-controller.js");
const { superAdminLogIn } = require("../controllers/super-admin-controller.js");
const {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  deleteTeachers,
  deleteTeachersByClass,
  deleteTeacher,
  updateTeacherSubject,
  teacherAttendance,
  addClassToTeacher,
  getTeachersByClassId,
  removeClassFromTeacher,
  updateTeacher,
} = require("../controllers/teacher-controller.js");
const {
  verifySuperAdmin,
  verifyAdmin,
  verifyTeacherOrAdmin,
} = require("../middleware/VertifyUser.js");

// superadmin
router.post("/SuperAdminLogin", superAdminLogIn);

// Admin
router.post("/AdminReg", verifySuperAdmin, adminRegister);
router.post("/AdminLogin", adminLogIn);
router.get("/Admin/:id", verifySuperAdmin, getAdminDetail);
router.get("/Admins", verifySuperAdmin, getAdmins);
router.delete("/Admin/:id", verifySuperAdmin, deleteAdmin);
router.put("/Admin/:id", verifySuperAdmin, updateAdmin);

// parent
router.post("/ParentReg", verifyAdmin, registerParent);
router.post("/ParentLogin", parentLogIn);
router.get("/Parent/:id", verifyAdmin, getParentById);
router.get("/Parents", verifyAdmin, getAllParents);
router.delete("/Parent/:id", verifyAdmin, deleteParent);
router.put("/Parent/:id", verifyAdmin, updateParent);

// Student

router.post("/StudentReg", verifyAdmin, studentRegister);

router.get("/Students/:id", verifyTeacherOrAdmin, getStudents);
router.get("/Student/:id", verifyTeacherOrAdmin, getStudentDetail);

router.delete("/Students/:id", verifyAdmin, deleteStudents);
router.delete("/StudentsClass/:id", verifyAdmin, deleteStudentsByClass);
router.delete("/Student/:id", verifyAdmin, deleteStudent);

router.put("/Student/:id", verifyAdmin, updateStudent);

router.put("/UpdateExamResult/:id", updateExamResult);

router.put("/StudentAttendance/:id", verifyTeacherOrAdmin, studentAttendance);

router.put(
  "/RemoveAllStudentsSubAtten/:id",
  verifyAdmin,
  clearAllStudentsAttendanceBySubject
);
router.put(
  "/RemoveAllStudentsAtten/:id",
  verifyAdmin,
  clearAllStudentsAttendance
);

router.put(
  "/RemoveStudentSubAtten/:id",
  verifyAdmin,
  removeStudentAttendanceBySubject
);
router.put("/RemoveStudentAtten/:id", verifyAdmin, removeStudentAttendance);

// Teacher

router.post("/TeacherReg", verifyAdmin, teacherRegister);
router.post("/TeacherLogin", teacherLogIn);
router.post("/Teacher/addSubject/:id", verifyAdmin, addClassToTeacher);

router.get("/Teachers/:id", verifyAdmin, getTeachers);
router.get("/Teacher/:id", verifyAdmin, getTeacherDetail);
router.put("/Teacher/update/:id", verifyAdmin, updateParent);
router.get("/Teacher/class/:id", verifyAdmin, getTeachersByClassId);
router.delete(
  "/Teacher/class/:teacherID/:classID",
  verifyAdmin,
  removeClassFromTeacher
);
router.put("/Teacher/:id", verifyAdmin, updateTeacher);

router.delete("/Teachers/:id", verifyAdmin, deleteTeachers);
router.delete("/TeachersClass/:id", verifyAdmin, deleteTeachersByClass);
router.delete("/Teacher/:id", verifyAdmin, deleteTeacher);

router.put("/TeacherSubject", verifyAdmin, updateTeacherSubject);

router.post("/TeacherAttendance/:id", verifyTeacherOrAdmin, teacherAttendance);

// Notice

router.post("/NoticeCreate", verifyAdmin, noticeCreate);

router.get("/NoticeList/:id", noticeList);

router.delete("/Notices/:id", verifyAdmin, deleteNotices);
router.delete("/Notice/:id", verifyAdmin, deleteNotice);

router.put("/Notice/:id", verifyAdmin, updateNotice);

// Complain

router.post("/ComplainCreate", complainCreate);
router.delete("/Complain/:id", verifyAdmin, deleteComplaint);

router.get("/ComplainList", complainList);

// Sclass

router.post("/SclassCreate", verifyAdmin, sclassCreate);

router.get("/SclassList/:id", verifyTeacherOrAdmin, sclassList);
router.get("/Sclass/:id", verifyTeacherOrAdmin, getSclassDetail);

router.get("/Sclass/Students/:id", verifyTeacherOrAdmin, getSclassStudents);
router.post("/Sclass/homeroom/:id", verifyAdmin, updateHomeroomTeacher);

router.delete("/Sclasses/:id", verifyAdmin, deleteSclasses);
router.delete("/Sclass/:id", verifyAdmin, deleteSclass);

// Subject

router.post("/SubjectCreate", verifyAdmin, subjectCreate);

router.get("/AllSubjects/:id", verifyAdmin, allSubjects);
router.get("/ClassSubjects/:id", verifyTeacherOrAdmin, classSubjects);
router.get("/FreeSubjectList/:id", verifyTeacherOrAdmin, freeSubjectList);
router.get("/Subject/:id", verifyTeacherOrAdmin, getSubjectDetail);
router.put("/Subject/:id", verifyAdmin, updateSubject);

router.delete("/Subject/:id", verifyAdmin, deleteSubject);
router.delete("/Subjects/:id", verifyAdmin, deleteSubjects);
router.delete("/SubjectsClass/:id", verifyAdmin, deleteSubjectsByClass);

//events
router.get("/events/:id", getEvents);
router.post("/events", addEvent);
router.get("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

module.exports = router;
