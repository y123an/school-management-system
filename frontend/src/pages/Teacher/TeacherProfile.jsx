import React, { useState } from "react";
import { useSelector } from "react-redux";
import TeacherSideBar from "./TeacherSideBar";
import AccountMenu from "../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const teachSclass = currentUser.teachSclass;
  const teachSubject = currentUser.teachSubject;
  const teachSchool = currentUser.school;

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="h-screen font-poppins bg-gray-100">
      <div className="flex items-center justify-between h-16 px-6 bg-white shadow-md">
        <button
          onClick={toggleDrawer}
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
        >
          {open ? <IoMdArrowBack /> : <IoIosMenu />}
        </button>
        <span className="text-lg font-semibold">Teachers Dashboard</span>
        <AccountMenu />
      </div>
      <div className="flex h-full">
        <div
          className={`bg-white ${
            open ? "block" : "hidden"
          } lg:block border-r border-gray-200 w-64`}
        >
          <TeacherSideBar />
        </div>
        <div className="mt-20 mx-auto w-80 border rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Teacher Profile</h2>
          <div className="flex flex-col">
            <p className="mb-2">
              <span className="font-semibold">Name:</span> {currentUser.name}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {currentUser.email}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Class:</span>{" "}
              {teachSclass.sclassName}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Subject:</span>{" "}
              {teachSubject.subName}
            </p>
            <p className="mb-2">
              <span className="font-semibold">School:</span>{" "}
              {teachSchool.schoolName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
