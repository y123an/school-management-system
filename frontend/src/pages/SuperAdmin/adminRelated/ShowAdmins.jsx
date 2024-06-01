import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAdmins } from "../../../redux/adminRelated/adminHandler";
import { deleteUser } from "../../../redux/userRelated/userHandle";
// import {
//   BlackButton,
//   BlueButton,
//   GreenButton,
// } from "../../../components/ButtonStyles";
import TableTemplate from "../../../components/TableTemplate";
import Popup from "../../../components/Popup";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const ShowAdmins = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllAdmins(currentUser._id));
  }, [currentUser._id, dispatch]);

  const { adminsList, loading, error, response } = useSelector(
    (state) => state.admin
  );

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry, the delete function has been disabled for now.");
    // setShowPopup(true);

    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllAdmins(currentUser._id));
    });
  };

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "schoolName", label: "School Name", minWidth: 170 },
  ];

  console.log(adminsList);
  const studentRows =
    adminsList &&
    adminsList.length > 0 &&
    adminsList.map((admin) => {
      return {
        name: admin.name,
        email: admin.email,
        schoolName: admin.schoolName,
        id: admin._id,
      };
    });

  const StudentButtonHaver = ({ row }) => {
    const options = ["Take Attendance", "Provide Marks"];

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleMarks();
      }
    };

    const handleAttendance = () => {
      navigate("/SuperAdmin/students/student/attendance/" + row.id);
    };
    const handleMarks = () => {
      navigate("/SuperAdmin/students/student/marks/" + row.id);
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    return (
      <>
        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => deleteHandler(row.id, "Student")}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          onClick={() => navigate("/SuperAdmin/students/student/" + row.id)}
        >
          View
        </button>
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-expanded="true"
              aria-haspopup="true"
              ref={anchorRef}
              onClick={handleToggle}
            >
              {options[selectedIndex]}
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.993.883L11 4v12a1 1 0 01-1.993.117L9 16V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {open && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex="-1"
            >
              <div className="py-1" role="none">
                {options.map((option, index) => (
                  <button
                    key={option}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={(event) => handleMenuItemClick(event, index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const actions = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
      ),
      name: "Add New Student",
      action: () => navigate("/SuperAdmin/addstudents"),
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      ),
      name: "Delete All Students",
      action: () => deleteHandler(currentUser._id, "Students"),
    },
  ];

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
          <>
            {loading ? (
              <div className="flex justify-center items-center min-h-screen">
                <div className="loader">Loading...</div>
              </div>
            ) : (
              <>
                {response ? (
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => navigate("/SuperAdmin/addAdmins")}
                    >
                      Add Admin
                    </button>
                  </div>
                ) : (
                  <div className="w-full overflow-hidden">
                    {Array.isArray(adminsList) && adminsList.length > 0 && (
                      <TableTemplate
                        buttonHaver={StudentButtonHaver}
                        columns={studentColumns}
                        rows={studentRows}
                      />
                    )}
                  </div>
                )}
              </>
            )}
            <Popup
              message={message}
              setShowPopup={setShowPopup}
              showPopup={showPopup}
            />
          </>
        </div>
      </div>
    </>
  );
};

export default ShowAdmins;
