import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TeacherSideBar from "./TeacherSideBar";
import AccountMenu from "../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { getTeacherDetails } from "../../redux/teacherRelated/teacherHandle";
import { current } from "@reduxjs/toolkit";

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }
  const { teacherDetails } = useSelector((state) => state.teacher);

  const teacherID = currentUser._id;

  useEffect(() => {
    dispatch(getTeacherDetails(teacherID));
  }, [dispatch, teacherID]);

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
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
              <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                Teacher Details
              </h1>
              <div className="mb-6">
                <p className="text-xl mb-4">
                  <strong>Teacher Name:</strong> {teacherDetails?.name}
                </p>
                <p className="text-xl mb-4">
                  <strong>Email:</strong> {teacherDetails?.email}
                </p>
                <p className="text-xl mb-4">
                  <strong>Role:</strong> {teacherDetails?.role}
                </p>
                <div className="text-xl mb-4">
                  <strong>Classes:</strong>
                  {teacherDetails?.classes?.map((cls, index) => (
                    <div
                      key={index}
                      className="p-4 mt-4 border rounded-lg shadow-sm flex flex-col gap-2 bg-gray-50"
                    >
                      <span className="text-lg">
                        <strong>Class Name:</strong>{" "}
                        {cls?.teachSclass?.gradelevel}{" "}
                        {cls?.teachSclass?.section}
                      </span>
                      <span className="text-lg">
                        <strong>Subject Name:</strong>{" "}
                        {cls?.teachSubject?.subName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
