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
  const { studentsList, loading, error } = useSelector(
    (state) => state.student
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllStudents(currentUser._id));
  }, [currentUser._id, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);

  const confirmDelete = () => {
    const { deleteID, address } = deleteInfo;
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllStudents(currentUser._id));
      setShowPopup(true);
      setMessage("Student deleted successfully!");
    });
    setShowConfirmModal(false);
  };

  const deleteHandler = (deleteID, address) => {
    setDeleteInfo({ deleteID, address });
    setShowConfirmModal(true);
  };

  const studentColumns = [
    { id: "firstName", label: "First Name", minWidth: 170 },
    { id: "lastName", label: "Last Name", minWidth: 170 },
    { id: "gender", label: "Gender", minWidth: 170 },
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
        gender: student.gender,
        studentID: student.studentID,
        className: student.className,
        id: student._id,
      };
    });

  const StudentButtonHaver = ({ row }) => {
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
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          onClick={() =>
            navigate("/SuperAdmin/student/update/" + row.id, {
              state: {
                student: row,
              },
            })
          }
        >
          Update
        </button>
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
          {/* Confirm Delete Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                <p>Are you sure you want to delete this student?</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowStudents;
