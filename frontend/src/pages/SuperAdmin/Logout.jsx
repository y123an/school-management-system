import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../../redux/userRelated/userSlice";
import SideBar from "./SideBar";
import AccountMenu from "../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const Logout = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authLogout());
    navigate("/");
  };

  const handleCancel = () => {
    navigate(-1);
  };

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
        <span className="text-lg font-semibold">Super Admin Dashboard</span>
        <AccountMenu />
      </div>
      <div className="flex">
        <div
          className={`transition-transform duration-300 ${
            open ? "w-64" : "w-0"
          } bg-white shadow-lg`}
        ></div>
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Logout</h2>
            <p className="mb-4 text-lg text-center">
              Are you sure you want to log out, {currentUser.name}?
            </p>
            <div className="flex space-x-4">
              <button
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                onClick={handleLogout}
              >
                Log Out
              </button>
              <button
                className="w-full px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-opacity-50"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
