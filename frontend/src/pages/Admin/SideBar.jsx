import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiHome3Line,
  RiUserLine,
  RiLogoutBoxRLine,
  RiAccountCircleLine,
  RiNotification2Line,
  RiBook2Line,
  RiGroupLine,
  RiAlertLine,
  RiFileTextLine,
} from "react-icons/ri";
import { CiCalendar } from "react-icons/ci";
const SideBar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="h-screen w-64 font-poppins bg-white shadow-lg rounded-lg p-4">
      <React.Fragment>
        <Link
          to="/Admin/dashboard"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/Admin/dashboard")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <RiHome3Line className="mr-3 text-xl" />
          <span className="text-md font-medium">Home</span>
        </Link>
        <Link
          to="/Admin/classes"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/Admin/classes")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <RiBook2Line className="mr-3 text-xl" />
          <span className="text-md font-medium">Classes</span>
        </Link>
        <Link
          to="/Admin/subjects"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/Admin/subjects")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <RiFileTextLine className="mr-3 text-xl" />
          <span className="text-md font-medium">Subjects</span>
        </Link>
        <Link
          to="/Admin/teachers"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/Admin/teachers")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <RiGroupLine className="mr-3 text-xl" />
          <span className="text-md font-medium">Teachers</span>
        </Link>
        <Link
          to="/Admin/students"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/Admin/students")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <RiUserLine className="mr-3 text-xl" />
          <span className="text-md font-medium">Students</span>
        </Link>
        <Link
          to="/Admin/parents"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/Admin/parents")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <RiUserLine className="mr-3 text-xl" />
          <span className="text-md font-medium">Parents</span>
        </Link>
        <Link
          to="/Admin/notices"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/Admin/notices")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <RiNotification2Line className="mr-3 text-xl" />
          <span className="text-md font-medium">Announcement</span>
        </Link>
        <Link
          to="/Admin/complains"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/Admin/complains")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <RiNotification2Line className="mr-3 text-xl" />
          <span className="text-md font-medium">Complains</span>
        </Link>
        <Link
          to="/Admin/calender"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/Admin/calender")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <CiCalendar className="mr-3 text-xl" />
          <span className="text-md font-medium">Calender</span>
        </Link>
      </React.Fragment>
      <hr className="my-3 border-gray-300" />
      <React.Fragment>
        <span className="block py-3 px-5 text-gray-500 text-md font-medium">
          User
        </span>

        <Link
          to="/Admin/profile"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/Admin/profile")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <RiAccountCircleLine className="mr-3 text-xl" />
          <span className="text-md font-medium">Profile</span>
        </Link>
        <Link
          to="/logout"
          className={`block py-3 px-5 my-1 flex items-center rounded-lg transition-all duration-300 ${
            isActive("/logout")
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          }`}
        >
          <RiLogoutBoxRLine className="mr-3 text-xl" />
          <span className="text-md font-medium">Logout</span>
        </Link>
      </React.Fragment>
    </div>
  );
};

export default SideBar;
