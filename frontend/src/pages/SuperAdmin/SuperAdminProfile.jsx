import React, { useState } from "react";
import { useSelector } from "react-redux";
import SideBar from "./SideBar";
import AccountMenu from "../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const SuperAdminProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="min-h-screen font-poppins bg-gray-100">
      <div className="flex items-center justify-between h-16 px-6 bg-white shadow-md">
        <button
          onClick={toggleDrawer}
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
        >
          {open ? <IoMdArrowBack /> : <IoIosMenu />}
        </button>
        <span className="text-lg font-semibold">Super Admin Dashboard</span>
        <AccountMenu />
      </div>
      <div className="flex flex-col lg:flex-row h-full">
        <div className="bg-white border-b border-gray-200 w-64 lg:border-r lg:border-b-0">
          <SideBar />
        </div>
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Super Admin Profile
            </h2>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <span className="text-gray-600 font-semibold">Name:</span>
                <p className="text-gray-800">{currentUser.name}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 font-semibold">Email:</span>
                <p className="text-gray-800">{currentUser.email}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 font-semibold">School:</span>
                <p className="text-gray-800">{currentUser.schoolName}</p>
              </div>
              {/* Add Delete and Edit Profile functionality */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminProfile;
