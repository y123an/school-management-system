import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SuperAdminHomePage from "./pages/SuperAdmin/SuperAdminHomepage";
import SuperAdminProfile from "./pages/SuperAdmin/SuperAdminProfile";
import ShowClasses from "./pages/SuperAdmin/classRelated/ShowClasses";
import AddClass from "./pages/SuperAdmin/classRelated/AddClass";

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

        {/* <Route path="*" element={<Navigate to="/" />} />
        <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
          <Route path="/Admin/dashboard" element={<AdminHomePage />} />
          <Route path="/Admin/complains" element={<SeeComplains />} />
          <Route path="/Admin/addnotice" element={<AddNotice />} />
          <Route path="/Admin/notices" element={<ShowNotices />} />
          <Route path="/Admin/subjects" element={<ShowSubjects />} />
          <Route
            path="/Admin/subjects/subject/:classID/:subjectID"
            element={<ViewSubject />}
          />
          <Route
            path="/Admin/subjects/chooseclass"
            element={<ChooseClass situation="Subject" />}
          />
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
            path="/Admin/subject/student/marks/:studentID/:subjectID"
            element={<StudentExamMarks situation="Subject" />}
          />
          <Route
            path="/Admin/class/addstudents/:id"
            element={<AddStudent situation="Class" />}
          />
          <Route
            path="/Admin/addstudents"
            element={<AddStudent situation="Student" />}
          />
          <Route path="/Admin/students" element={<ShowStudents />} />
          <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
          <Route
            path="/Admin/students/student/attendance/:id"
            element={<StudentAttendance situation="Student" />}
          />
          <Route
            path="/Admin/students/student/marks/:id"
            element={<StudentExamMarks situation="Student" />}
          />
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
            path="/Admin/teachers/choosesubject/:id"
            element={<ChooseSubject situation="Norm" />}
          />
          <Route
            path="/Admin/teachers/choosesubject/:classID/:teacherID"
            element={<ChooseSubject situation="Teacher" />}
          />
          <Route
            path="/Admin/teachers/addteacher/:id"
            element={<AddTeacher />}
          />
          <Route path="/logout" element={<Logout />} />
        </Routes> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
