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
  // const sclassName = currentUser.teachSclass;
  const location = useLocation();

  return (
    <div className="h-screen w-64 font-poppins bg-white shadow-lg rounded-lg p-4">
      <div>
        <Link
          to="/Teacher/dashboard"
          className={`py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            location.pathname === "/" ||
            location.pathname === "/Teacher/dashboard"
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <FaHome className="w-6 h-6 mr-2" />
          <span>Home</span>
        </Link>
        <Link
          to="/Teacher/class"
          className={`py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            location.pathname.startsWith("/Teacher/class")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <FaChalkboardTeacher className="w-6 h-6 mr-2" />
          <span>Classes</span>
        </Link>
      </div>
      <hr className="my-4 border-t border-gray-300" />
      <div className="mt-4">
        <p className="text-gray-500 text-sm">User</p>
        <Link
          to="/Teacher/profile"
          className={`py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            location.pathname.startsWith("/Teacher/profile")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <FaUserCircle className="w-6 h-6 mr-2" />
          <span>Profile</span>
        </Link>
        <Link
          to="/logout"
          className={`py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            location.pathname.startsWith("/logout")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <FaSignOutAlt className="w-6 h-6 mr-2" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default TeacherSideBar;
