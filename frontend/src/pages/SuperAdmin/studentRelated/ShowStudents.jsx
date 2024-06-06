import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import TableTemplate from "../../../components/TableTemplate";
import Popup from "../../../components/Popup";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { AiOutlineUserAdd, AiOutlineDelete } from "react-icons/ai";
import { MdDelete, MdOutlineViewList } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentsList, loading, error, response } = useSelector(
    (state) => state.student
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllStudents(currentUser._id));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllStudents(currentUser._id));
    });
  };

  const studentColumns = [
    { id: "firstName", label: "First Name", minWidth: 170 },
    { id: "lastName", label: "Last Name", minWidth: 170 },
    { id: "grandfatherName", label: "Grand Father Name", minWidth: 170 },
    { id: "studentID", label: "Student ID", minWidth: 100 },
    { id: "className", label: "Class", minWidth: 170 },
  ];

  const studentRows =
    studentsList &&
    studentsList.length > 0 &&
    studentsList.map((student) => {
      return {
        firstName: student.firstName,
        lastName: student.lastName,
        grandfatherName: student.grandfathersName,
        studentID: student.studentID,
        className: student.className,
        id: student._id,
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
      handleClick();
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
      <div className="flex gap-3">
        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => deleteHandler(row.id, "Student")}
        >
          <MdDelete size={30} />
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          onClick={() => navigate("/SuperAdmin/students/student/" + row.id)}
        >
          View
        </button>
        {/* <div className="relative inline-block text-left">
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
        </div> */}
      </div>
    );
  };

  const actions = [
    {
      icon: <AiOutlineUserAdd className="w-6 h-6 text-blue-600" />,
      name: "Add New Student",
      action: () => navigate("/SuperAdmin/addstudents"),
    },
    {
      icon: <AiOutlineDelete className="w-6 h-6 text-red-600" />,
      name: "Delete All Students",
      action: () => deleteHandler(currentUser._id, "Students"),
    },
  ];

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  console.log(studentsList);

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
        <div className="">
          <div
            className={`bg-white shadow-md transition-transform ${
              open ? "w-64" : "w-0"
            } overflow-hidden`}
          >
            <SideBar />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition duration-300"
                  onClick={() => navigate("/SuperAdmin/addstudents")}
                >
                  Add Students
                </button>
              </div>

              <div className="w-full overflow-hidden">
                {Array.isArray(studentsList) && studentsList.length > 0 && (
                  <TableTemplate
                    buttonHaver={StudentButtonHaver}
                    columns={studentColumns}
                    rows={studentRows}
                  />
                )}
              </div>
            </>
          )}
          <Popup
            message={message}
            setShowPopup={setShowPopup}
            showPopup={showPopup}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowStudents;
