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
  RiSettings3Line,
} from "react-icons/ri";

const SideBar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      <React.Fragment>
        <Link
          to="/SuperAdmin/dashboard"
          className="block py-2 px-4 flex items-center"
        >
          <RiHome3Line
            className={`mr-3 ${
              isActive("/SuperAdmin/dashboard")
                ? "text-primary"
                : "text-gray-600"
            }`}
          />
          <span className="text-sm">Home</span>
        </Link>
        <Link
          to="/SuperAdmin/classes"
          className="block py-2 px-4 flex items-center"
        >
          <RiBook2Line
            className={`mr-3 ${
              isActive("/SuperAdmin/classes") ? "text-primary" : "text-gray-600"
            }`}
          />
          <span className="text-sm">Classes</span>
        </Link>
        <Link
          to="/SuperAdmin/subjects"
          className="block py-2 px-4 flex items-center"
        >
          <RiFileTextLine
            className={`mr-3 ${
              isActive("/SuperAdmin/subjects")
                ? "text-primary"
                : "text-gray-600"
            }`}
          />
          <span className="text-sm">Subjects</span>
        </Link>
        <Link
          to="/SuperAdmin/teachers"
          className="block py-2 px-4 flex items-center"
        >
          <RiGroupLine
            className={`mr-3 ${
              isActive("/SuperAdmin/teachers")
                ? "text-primary"
                : "text-gray-600"
            }`}
          />
          <span className="text-sm">Teachers</span>
        </Link>
        <Link
          to="/SuperAdmin/students"
          className="block py-2 px-4 flex items-center"
        >
          <RiUserLine
            className={`mr-3 ${
              isActive("/SuperAdmin/students")
                ? "text-primary"
                : "text-gray-600"
            }`}
          />
          <span className="text-sm">Students</span>
        </Link>
        <Link
          to="/SuperAdmin/notices"
          className="block py-2 px-4 flex items-center"
        >
          <RiNotification2Line
            className={`mr-3 ${
              isActive("/SuperAdmin/notices") ? "text-primary" : "text-gray-600"
            }`}
          />
          <span className="text-sm">Notices</span>
        </Link>
        <Link
          to="/SuperAdmin/complains"
          className="block py-2 px-4 flex items-center"
        >
          <RiAlertLine
            className={`mr-3 ${
              isActive("/SuperAdmin/complains")
                ? "text-primary"
                : "text-gray-600"
            }`}
          />
          <span className="text-sm">Complains</span>
        </Link>
      </React.Fragment>
      <hr className="my-1" />
      <React.Fragment>
        <span className="block py-2 px-4 text-gray-400 text-sm">User</span>
        <Link
          to="/SuperAdmin/profile"
          className="block py-2 px-4 flex items-center"
        >
          <RiAccountCircleLine
            className={`mr-3 ${
              isActive("/Admin/profile") ? "text-primary" : "text-gray-600"
            }`}
          />
          <span className="text-sm">Profile</span>
        </Link>
        <Link to="/logout" className="block py-2 px-4 flex items-center">
          <RiLogoutBoxRLine
            className={`mr-3 ${
              isActive("/logout") ? "text-primary" : "text-gray-600"
            }`}
          />
          <span className="text-sm">Logout</span>
        </Link>
      </React.Fragment>
    </>
  );
};

export default SideBar;
