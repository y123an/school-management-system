import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserCircle,
  FaExclamationCircle,
  FaChalkboardTeacher,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const TeacherSideBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const sclassName = currentUser.teachSclass;
  const location = useLocation();

  return (
    <>
      <div className="mt-4">
        <Link
          to="/Teacher/dashboard"
          className={`flex items-center ${
            location.pathname === "/" ||
            location.pathname === "/Teacher/dashboard"
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          <FaHome className="w-6 h-6 mr-2" />
          <span>Home</span>
        </Link>
        <Link
          to="/Teacher/class"
          className={`flex items-center mt-4 ${
            location.pathname.startsWith("/Teacher/class")
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          <FaChalkboardTeacher className="w-6 h-6 mr-2" />
          <span>Class {sclassName.sclassName}</span>
        </Link>
        <Link
          to="/Teacher/complain"
          className={`flex items-center mt-4 ${
            location.pathname.startsWith("/Teacher/complain")
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          <FaExclamationCircle className="w-6 h-6 mr-2" />
          <span>Complain</span>
        </Link>
      </div>
      <hr className="my-4 border-t border-gray-300" />
      <div className="mt-4">
        <p className="text-gray-500 text-sm">User</p>
        <Link
          to="/Teacher/profile"
          className={`flex items-center mt-2 ${
            location.pathname.startsWith("/Teacher/profile")
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          <FaUserCircle className="w-6 h-6 mr-2" />
          <span>Profile</span>
        </Link>
        <Link
          to="/logout"
          className={`flex items-center mt-2 ${
            location.pathname.startsWith("/logout")
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          <FaSignOutAlt className="w-6 h-6 mr-2" />
          <span>Logout</span>
        </Link>
      </div>
    </>
  );
};

export default TeacherSideBar;
