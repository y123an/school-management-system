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
        <span className="text-lg font-semibold">Teacher's Dashboard</span>
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
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Teacher Profile
            </h2>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <span className="text-gray-600 font-semibold">Name:</span>
                <p className="text-gray-900">{currentUser.name}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 font-semibold">Email:</span>
                <p className="text-gray-900">{currentUser.email}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 font-semibold">Class:</span>
                <p className="text-gray-900">{teachSclass.sclassName}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 font-semibold">Subject:</span>
                <p className="text-gray-900">{teachSubject.subName}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 font-semibold">School:</span>
                <p className="text-gray-900">{teachSchool.schoolName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
