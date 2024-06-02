import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SuperAdminHomePage from "./pages/SuperAdmin/SuperAdminHomepage";
import SuperAdminProfile from "./pages/SuperAdmin/SuperAdminProfile";
import SuperAdminShowClasses from "./pages/SuperAdmin/classRelated/ShowClasses";
import SuperAdminAddClass from "./pages/SuperAdmin/classRelated/AddClass";
import SuperAdminClassDetails from "./pages/SuperAdmin/classRelated/ClassDetails";
import SuperAdminAddStudent from "./pages/SuperAdmin/studentRelated/AddStudent";
import SuperAdminShowStudents from "./pages/SuperAdmin/studentRelated/ShowStudents";
import SuperAdminViewStudent from "./pages/SuperAdmin/studentRelated/ViewStudent";
import SuperAdminStudentAttendance from "./pages/SuperAdmin/studentRelated/StudentAttendance";
import SuperAdminStudentExamMarks from "./pages/SuperAdmin/studentRelated/StudentExamMarks";
import SuperAdminSubjectForm from "./pages/SuperAdmin/subjectRelated/SubjectForm";
import SuperAdminViewSubject from "./pages/SuperAdmin/subjectRelated/ViewSubject";
import SuperAdminAddTeacher from "./pages/SuperAdmin/teacherRelated/AddTeacher";
import SuperAdminShowSubjects from "./pages/SuperAdmin/subjectRelated/ShowSubjects";
import SuperAdminChooseClass from "./pages/SuperAdmin/teacherRelated/ChooseClass";
import SuperAdminShowTeachers from "./pages/SuperAdmin/teacherRelated/ShowTeachers";
import SuperAdminTeacherDetails from "./pages/SuperAdmin/teacherRelated/TeacherDetails";
import SuperAdminChooseSubject from "./pages/SuperAdmin/teacherRelated/ChooseSubject";
import SuperAdminShowNotices from "./pages/SuperAdmin/Announcement/ShowNotices";
import SuperAdminAddNotice from "./pages/SuperAdmin/Announcement/AddNotice";
import SuperAdminSeeComplains from "./pages/SuperAdmin/studentRelated/SeeComplains";
import Logout from "./pages/SuperAdmin/Logout";
import SuperAdminShowAdmins from "./pages/SuperAdmin/adminRelated/ShowAdmins";
import SuperAdminAddAdmin from "./pages/SuperAdmin/adminRelated/AddAdmin";
import AdminHomePage from "./pages/Admin/AdminHomepage";
import AdminProfile from "./pages/Admin/AdminProfile";
import AddClass from "./pages/Admin/classRelated/AddClass";
import ShowClasses from "./pages/Admin/classRelated/ShowClasses";
import ClassDetails from "./pages/Admin/classRelated/ClassDetails";
import AddStudent from "./pages/Admin/studentRelated/AddStudent";
import ShowStudents from "./pages/Admin/studentRelated/ShowStudents";
import ViewStudent from "./pages/SuperAdmin/studentRelated/ViewStudent";
import StudentAttendance from "./pages/SuperAdmin/studentRelated/StudentAttendance";
import StudentExamMarks from "./pages/SuperAdmin/studentRelated/StudentExamMarks";
import ShowSubjects from "./pages/Admin/subjectRelated/ShowSubjects";
import SubjectForm from "./pages/Admin/subjectRelated/SubjectForm";
import ViewSubject from "./pages/Admin/subjectRelated/ViewSubject";
import ChooseClass from "./pages/Admin/teacherRelated/ChooseClass";
import ChooseSubject from "./pages/Admin/teacherRelated/ChooseSubject";
import TeacherDetails from "./pages/Admin/teacherRelated/TeacherDetails";
import ShowTeachers from "./pages/Admin/teacherRelated/ShowTeachers";
import AddTeacher from "./pages/Admin/teacherRelated/AddTeacher";
import ShowNotices from "./pages/Admin/Announcement/ShowNotices";
import AddNotice from "./pages/Admin/Announcement/AddNotice";
import SeeComplains from "./pages/Admin/studentRelated/SeeComplains";
import TeacherHomePage from "./pages/Teacher/TeacherHomePage";
import TeacherProfile from "./pages/Teacher/TeacherProfile";
import TeacherClassDetails from "./pages/Teacher/TeacherClassDetails";
import TeacherViewStudent from "./pages/Teacher/TeacherViewStudent";
import TeacherStudentAttendance from "./pages/Teacher/StudentAttendance";
import TeacherStudentExamMarks from "./pages/Teacher/StudentExamMarks";
import TeacherComplain from "./pages/Teacher/TeacherComplain";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* super admin */}
        <Route
          path="/SuperAdmin/dashboard/*"
          element={<SuperAdminHomePage />}
          SuperAdmin
        />
        <Route path="/SuperAdmin/profile" element={<SuperAdminProfile />} />

        {/* class */}
        <Route path="/SuperAdmin/addclass" element={<SuperAdminAddClass />} />
        <Route path="/SuperAdmin/classes" element={<SuperAdminShowClasses />} />
        <Route
          path="/SuperAdmin/classes/class/:id"
          element={<SuperAdminClassDetails />}
        />

        {/* students */}
        <Route
          path="/SuperAdmin/class/addstudents/:id"
          element={<SuperAdminAddStudent situation="Class" />}
        />
        <Route
          path="/SuperAdmin/students"
          element={<SuperAdminShowStudents />}
        />
        <Route
          path="/SuperAdmin/students/student/:id"
          element={<SuperAdminViewStudent />}
        />
        <Route
          path="/SuperAdmin/students/student/attendance/:id"
          element={<SuperAdminStudentAttendance situation="Student" />}
        />
        <Route
          path="/SuperAdmin/addstudents"
          element={<SuperAdminAddStudent situation="Student" />}
        />

        <Route
          path="/SuperAdmin/students/student/marks/:id"
          element={<SuperAdminStudentExamMarks situation="Student" />}
        />

        {/* subjects */}
        <Route
          path="/SuperAdmin/subjects"
          element={<SuperAdminShowSubjects />}
        />
        <Route
          path="/SuperAdmin/addsubject/:id"
          element={<SuperAdminSubjectForm />}
        />
        <Route
          path="/SuperAdmin/class/subject/:classID/:subjectID"
          element={<SuperAdminViewSubject />}
        />
        <Route
          path="/SuperAdmin/subject/student/attendance/:studentID/:subjectID"
          element={<SuperAdminStudentAttendance situation="Subject" />}
        />
        <Route
          path="/SuperAdmin/subjects/subject/:classID/:subjectID"
          element={<SuperAdminViewSubject />}
        />
        <Route
          path="/SuperAdmin/subjects/chooseclass"
          element={<SuperAdminChooseClass situation="Subject" />}
        />
        <Route
          path="/SuperAdmin/subject/student/marks/:studentID/:subjectID"
          element={<SuperAdminStudentExamMarks situation="Subject" />}
        />

        {/* teacher */}

        <Route
          path="/SuperAdmin/teachers/addteacher/:id"
          element={<SuperAdminAddTeacher />}
        />
        <Route
          path="/SuperAdmin/teachers"
          element={<SuperAdminShowTeachers />}
        />
        <Route
          path="/SuperAdmin/teachers/teacher/:id"
          element={<SuperAdminTeacherDetails />}
        />
        <Route
          path="/SuperAdmin/teachers/chooseclass"
          element={<SuperAdminChooseClass situation="Teacher" />}
        />
        <Route
          path="/SuperAdmin/teachers/choosesubject/:classID/:teacherID"
          element={<SuperAdminChooseSubject situation="Teacher" />}
        />
        <Route
          path="/SuperAdmin/teachers/choosesubject/:id"
          element={<SuperAdminChooseSubject situation="Norm" />}
        />

        {/* admins */}
        <Route path="/SuperAdmin/admins" element={<SuperAdminShowAdmins />} />
        <Route path="/SuperAdmin/addAdmins" element={<SuperAdminAddAdmin />} />

        {/* anouncement  */}
        <Route path="/SuperAdmin/notices" element={<SuperAdminShowNotices />} />
        <Route path="/SuperAdmin/addnotice" element={<SuperAdminAddNotice />} />

        {/* complent */}

        <Route
          path="/SuperAdmin/complains"
          element={<SuperAdminSeeComplains />}
        />

        {/* admin */}
        <Route path="/Admin/dashboard/*" element={<AdminHomePage />} />
        <Route path="/Admin/profile" element={<AdminProfile />} />

        {/* class */}
        <Route path="/Admin/addclass" element={<AddClass />} />
        <Route path="/Admin/classes" element={<ShowClasses />} />
        <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />

        {/* students */}
        <Route
          path="/Admin/class/addstudents/:id"
          element={<AddStudent situation="Class" />}
        />
        <Route path="/Admin/students" element={<ShowStudents />} />
        <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
        <Route
          path="/Admin/students/student/attendance/:id"
          element={<StudentAttendance situation="Student" />}
        />
        <Route
          path="/Admin/addstudents"
          element={<AddStudent situation="Student" />}
        />

        <Route
          path="/Admin/students/student/marks/:id"
          element={<StudentExamMarks situation="Student" />}
        />

        {/* subjects */}
        <Route path="/Admin/subjects" element={<ShowSubjects />} />
        <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
        <Route
          path="/Admin/class/subject/:classID/:subjectID"
          element={<ViewSubject />}
        />
        <Route
          path="/Admin/subject/student/attendance/:studentID/:subjectID"
          element={<StudentAttendance situation="Subject" />}
        />
        <Route
          path="/Admin/subjects/subject/:classID/:subjectID"
          element={<ViewSubject />}
        />
        <Route
          path="/Admin/subjects/chooseclass"
          element={<ChooseClass situation="Subject" />}
        />
        <Route
          path="/Admin/subject/student/marks/:studentID/:subjectID"
          element={<StudentExamMarks situation="Subject" />}
        />

        {/* teacher */}

        <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />
        <Route path="/Admin/teachers" element={<ShowTeachers />} />
        <Route
          path="/Admin/teachers/teacher/:id"
          element={<TeacherDetails />}
        />
        <Route
          path="/Admin/teachers/chooseclass"
          element={<ChooseClass situation="Teacher" />}
        />
        <Route
          path="/Admin/teachers/choosesubject/:classID/:teacherID"
          element={<ChooseSubject situation="Teacher" />}
        />
        <Route
          path="/Admin/teachers/choosesubject/:id"
          element={<ChooseSubject situation="Norm" />}
        />

        {/* anouncement  */}
        <Route path="/Admin/notices" element={<ShowNotices />} />
        <Route path="/Admin/addnotice" element={<AddNotice />} />

        {/* complent */}

        <Route path="/Admin/complains" element={<SeeComplains />} />
        {/* logout */}
        <Route path="/logout" element={<Logout />} />

        {/* teacher */}

        <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
        <Route path="/Teacher/profile" element={<TeacherProfile />} />
        <Route path="/Teacher/class" element={<TeacherClassDetails />} />
        <Route
          path="/Teacher/class/student/:id"
          element={<TeacherViewStudent />}
        />
        <Route
          path="/Teacher/class/student/attendance/:studentID/:subjectID"
          element={<TeacherStudentAttendance situation="Subject" />}
        />
        <Route
          path="/Teacher/class/student/marks/:studentID/:subjectID"
          element={<TeacherStudentExamMarks situation="Subject" />}
        />
        <Route path="/Teacher/complain" element={<TeacherComplain />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
