import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SuperAdminHomePage from "./pages/SuperAdmin/SuperAdminHomepage";
import SuperAdminProfile from "./pages/SuperAdmin/SuperAdminProfile";
import ShowClasses from "./pages/SuperAdmin/classRelated/ShowClasses";
import AddClass from "./pages/SuperAdmin/classRelated/AddClass";
import ClassDetails from "./pages/SuperAdmin/classRelated/ClassDetails";
import AddStudent from "./pages/SuperAdmin/studentRelated/AddStudent";
import ShowStudents from "./pages/SuperAdmin/studentRelated/ShowStudents";
import ViewStudent from "./pages/SuperAdmin/studentRelated/ViewStudent";
import StudentAttendance from "./pages/SuperAdmin/studentRelated/StudentAttendance";
import StudentExamMarks from "./pages/SuperAdmin/studentRelated/StudentExamMarks";
import SubjectForm from "./pages/SuperAdmin/subjectRelated/SubjectForm";
import ViewSubject from "./pages/SuperAdmin/subjectRelated/ViewSubject";
import AddTeacher from "./pages/SuperAdmin/teacherRelated/AddTeacher";
import ShowSubjects from "./pages/SuperAdmin/subjectRelated/ShowSubjects";
import ChooseClass from "./pages/SuperAdmin/teacherRelated/ChooseClass";
import ShowTeachers from "./pages/SuperAdmin/teacherRelated/ShowTeachers";
import TeacherDetails from "./pages/SuperAdmin/teacherRelated/TeacherDetails";
import ChooseSubject from "./pages/SuperAdmin/teacherRelated/ChooseSubject";
import ShowNotices from "./pages/SuperAdmin/Announcement/ShowNotices";
import AddNotice from "./pages/SuperAdmin/Announcement/AddNotice";
import SeeComplains from "./pages/SuperAdmin/studentRelated/SeeComplains";
import Logout from "./pages/SuperAdmin/Logout";
import ShowAdmins from "./pages/SuperAdmin/adminRelated/ShowAdmins";
import AddAdmin from "./pages/SuperAdmin/adminRelated/AddAdmin";

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
        />
        <Route path="/SuperAdmin/profile" element={<SuperAdminProfile />} />

        {/* class */}
        <Route path="/SuperAdmin/addclass" element={<AddClass />} />
        <Route path="/SuperAdmin/classes" element={<ShowClasses />} />
        <Route
          path="/SuperAdmin/classes/class/:id"
          element={<ClassDetails />}
        />

        {/* students */}
        <Route
          path="/SuperAdmin/class/addstudents/:id"
          element={<AddStudent situation="Class" />}
        />
        <Route path="/SuperAdmin/students" element={<ShowStudents />} />
        <Route
          path="/SuperAdmin/students/student/:id"
          element={<ViewStudent />}
        />
        <Route
          path="/SuperAdmin/students/student/attendance/:id"
          element={<StudentAttendance situation="Student" />}
        />
        <Route
          path="/SuperAdmin/addstudents"
          element={<AddStudent situation="Student" />}
        />

        <Route
          path="/SuperAdmin/students/student/marks/:id"
          element={<StudentExamMarks situation="Student" />}
        />

        {/* subjects */}
        <Route path="/SuperAdmin/subjects" element={<ShowSubjects />} />
        <Route path="/SuperAdmin/addsubject/:id" element={<SubjectForm />} />
        <Route
          path="/SuperAdmin/class/subject/:classID/:subjectID"
          element={<ViewSubject />}
        />
        <Route
          path="/SuperAdmin/subject/student/attendance/:studentID/:subjectID"
          element={<StudentAttendance situation="Subject" />}
        />
        <Route
          path="/SuperAdmin/subjects/subject/:classID/:subjectID"
          element={<ViewSubject />}
        />
        <Route
          path="/SuperAdmin/subjects/chooseclass"
          element={<ChooseClass situation="Subject" />}
        />
        <Route
          path="/SuperAdmin/subject/student/marks/:studentID/:subjectID"
          element={<StudentExamMarks situation="Subject" />}
        />

        {/* teacher */}

        <Route
          path="/SuperAdmin/teachers/addteacher/:id"
          element={<AddTeacher />}
        />
        <Route path="/SuperAdmin/teachers" element={<ShowTeachers />} />
        <Route
          path="/SuperAdmin/teachers/teacher/:id"
          element={<TeacherDetails />}
        />
        <Route
          path="/SuperAdmin/teachers/chooseclass"
          element={<ChooseClass situation="Teacher" />}
        />
        <Route
          path="/SuperAdmin/teachers/choosesubject/:classID/:teacherID"
          element={<ChooseSubject situation="Teacher" />}
        />
        <Route
          path="/SuperAdmin/teachers/choosesubject/:id"
          element={<ChooseSubject situation="Norm" />}
        />

        {/* admins */}
        <Route path="/SuperAdmin/admins" element={<ShowAdmins />} />
        <Route path="/SuperAdmin/addAdmins" element={<AddAdmin />} />

        {/* anouncement  */}
        <Route path="/SuperAdmin/notices" element={<ShowNotices />} />
        <Route path="/SuperAdmin/addnotice" element={<AddNotice />} />

        {/* complent */}

        <Route path="/SuperAdmin/complains" element={<SeeComplains />} />

        {/* logout */}
        <Route path="/logout" element={<Logout />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
