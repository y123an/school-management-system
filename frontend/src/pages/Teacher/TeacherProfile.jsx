import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TeacherSideBar from "./TeacherSideBar";
import AccountMenu from "../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import {
  getTeacherDetails,
  updateTeacherFields,
} from "../../redux/teacherRelated/teacherHandle";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const TeacherProfile = () => {
  const { currentUser, currentRole, error } = useSelector(
    (state) => state.user
  );
  const { teacherDetails } = useSelector((state) => state.teacher);
  const dispatch = useDispatch();

  const teacherID = currentUser._id;

  useEffect(() => {
    dispatch(getTeacherDetails(teacherID));
  }, [dispatch, teacherID]);

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (teacherDetails) {
      setFormData({
        name: teacherDetails.name,
        email: teacherDetails.email,
      });
    }
  }, [teacherDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTeacherFields(teacherID, formData, "Teacher"));
    dispatch(getTeacherDetails(teacherID));
  };

  // State for password modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Handler for opening and closing password modal
  const togglePasswordModal = () => {
    setPasswordModalOpen(!passwordModalOpen);
  };

  // Handler for changing password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Handle case where token is not available
        return;
      }

      const response = await axios.put(
        `http://localhost:4000/change-password/${teacherID}`,
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
        setPasswordModalOpen(false);
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
          <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
              Teacher Profile
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Teacher Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Teacher Name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="email"
                  placeholder="Email"
                />
              </div>
              <div className="text-xl mb-4">
                <strong>Classes:</strong>
                {teacherDetails?.classes?.map((cls, index) => (
                  <div
                    key={index}
                    className="p-4 mt-4 border rounded-lg shadow-sm flex flex-col gap-2 bg-gray-50"
                  >
                    <span className="text-lg">
                      <strong>Class Name:</strong>{" "}
                      {cls?.teachSclass?.gradelevel} {cls?.teachSclass?.section}
                    </span>
                    <span className="text-lg">
                      <strong>Subject Name:</strong>{" "}
                      {cls?.teachSubject?.subName}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Profile
                </button>
              </div>
            </form>
            {/* Change password button */}
            <button
              onClick={togglePasswordModal}
              className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/3 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Old Password
                </label>
                <input
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Old Password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={togglePasswordModal}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-4 focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default TeacherProfile;
