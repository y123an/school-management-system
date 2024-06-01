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
    <>
      <div className="h-screen">
        <div className="flex items-center  justify-between h-16 px-6 border-b border-gray-200">
          <button
            onClick={toggleDrawer}
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            {open ? <IoMdArrowBack /> : <IoIosMenu />}
          </button>
          <span className="text-lg font-semibold">Super Admin Dashboard</span>

          <AccountMenu />
        </div>
        <div className="flex h-screen">
          <div className="bg-white border-b border-gray-200 w-64">
            <SideBar />
          </div>
          <div className="border border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center shadow-md bg-purple-200 text-black">
            <h1>{currentUser.name}</h1>
            <p className="mb-4 text-lg text-center">
              Are you sure you want to log out?
            </p>
            <button
              className="px-4 py-2 mt-2 bg-red-600 text-white rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
              onClick={handleLogout}
            >
              Log Out
            </button>
            <button
              className="px-4 py-2 mt-2 bg-purple-700 text-white rounded-lg hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-opacity-50"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;
