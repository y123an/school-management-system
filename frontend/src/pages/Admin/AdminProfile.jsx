import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import SideBar from "./SideBar";
import AccountMenu from "../../components/AccountMenu";
import {
  getAdminDetails,
  updateAdminFields,
} from "../../redux/adminRelated/adminHandler";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { underAdminControl } from "../../redux/adminRelated/adminSlice";

const AdminProfile = () => {
  const { currentUser, currentRole } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordPopupOpen, setPasswordPopupOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
      });
    }
  }, [currentUser]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateAdminFields(currentUser._id, formData, "Admin"));
    dispatch(getAdminDetails(currentUser._id));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Handle case where token is not available
        return;
      }

      const response = await axios.put(
        `http://localhost:4000/change-password/${currentUser._id}`,
        { ...passwordData, role: currentRole },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response status is successful (2xx range)
      if (response.status >= 200 && response.status < 300) {
        toast.success("Password changed successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset password fields and close modal
        setPasswordData({
          oldPassword: "",
          newPassword: "",
        });
      } else {
        // Display generic error message
        toast.error("Failed to change password", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      // Check if the error response contains a specific message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Display specific error message from server
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Display generic error message for other errors
        toast.error("An error occurred", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const { statestatus, response, error, tempDetails } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if (statestatus === "added") {
      dispatch(underAdminControl());
      toast.success("Profile changed successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (statestatus === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (statestatus === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [statestatus, error, response, dispatch, tempDetails]);

  return (
    <div className="min-h-screen font-poppins bg-gray-100">
      <div className="flex items-center justify-between h-16 px-6 bg-white shadow-md">
        <button
          onClick={toggleDrawer}
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
        >
          {open ? <IoMdArrowBack /> : <IoIosMenu />}
        </button>
        <span className="text-lg font-semibold">Admin Dashboard</span>
        <AccountMenu />
      </div>
      <div className="flex flex-col lg:flex-row h-full">
        <div
          className={`bg-white ${
            open ? "block" : "hidden"
          } lg:block border-r border-gray-200 w-64`}
        >
          <SideBar />
        </div>
        <div className="flex flex-col items-center justify-center flex-grow p-8">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Admin Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col">
                <label
                  className="text-gray-600 font-semibold mb-2"
                  htmlFor="name"
                >
                  Name:
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                />
              </div>
              <div className="flex flex-col">
                <label
                  className="text-gray-600 font-semibold mb-2"
                  htmlFor="email"
                >
                  Email:
                </label>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="email"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setPasswordPopupOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Change Password
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Change Password Popup */}
      {passwordPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          <div className="bg-white w-96 rounded-lg overflow-hidden z-10">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Old Password
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Old Password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setPasswordPopupOpen(false)}
                    className="text-gray-600 hover:text-gray-700 font-semibold mr-4 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminProfile;
