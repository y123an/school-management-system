import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import TableTemplate from "../../../components/TableTemplate";
import Popup from "../../../components/Popup";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { getAllParents } from "../../../redux/parentRelated/parentHandler";

const ShowParents = () => {
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllParents(currentUser._id));
  }, [currentUser._id, dispatch]);

  const { parentsList, loading, error, response } = useSelector(
    (state) => state.parent
  );

  if (error) {
    console.log(error);
  }

  console.log(parentsList);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);

  const confirmDelete = () => {
    const { deleteID, address } = deleteInfo;
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllParents(currentUser._id));
      setShowPopup(true);
      setMessage("Parent deleted successfully!");
    });
    setShowConfirmModal(false);
  };

  const deleteHandler = (deleteID, address) => {
    setDeleteInfo({ deleteID, address });
    setShowConfirmModal(true);
  };

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "gender", label: "Gender", minWidth: 170 },
    { id: "phone", label: "Phone", minWidth: 170 },
    { id: "role", label: "Role", minWidth: 170 },
  ];

  const studentRows =
    parentsList &&
    parentsList.length > 0 &&
    parentsList.map((parent) => {
      return {
        name: parent.name,
        email: parent.email,
        schoolName: parent.schoolName,
        gender: parent.gender,
        phone: parent.phone,
        role: parent.role,
        Children: parent.Children,
        id: parent._id,
      };
    });

  console.log(parentsList);

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
          onClick={() => deleteHandler(row.id, "Parent")}
        >
          <MdDelete size={24} />
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          onClick={() =>
            navigate("/SuperAdmin/Parents/update/" + row.id, {
              state: {
                parent: row,
              },
            })
          }
        >
          Update
        </button>
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
      name: "Add New Parent",
      action: () => navigate("/SuperAdmin/addParents"),
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
      name: "Delete All Parents",
      action: () => deleteHandler(currentUser._id, "Parents"),
    },
  ];

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-screen font-poppins">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
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
          <div className="">
            <div
              className={`bg-white shadow-md transition-transform ${
                open ? "w-64" : "w-0"
              } overflow-hidden`}
            >
              <SideBar />
            </div>
          </div>
          <>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <FaSpinner className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <div className="flex flex-col w-full p-10">
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/SuperAdmin/addParents")}
                  >
                    Add Parent
                  </button>
                </div>

                <div className="w-full overflow-hidden">
                  {Array.isArray(parentsList) && parentsList.length > 0 && (
                    <TableTemplate
                      buttonHaver={StudentButtonHaver}
                      columns={studentColumns}
                      rows={studentRows}
                    />
                  )}
                </div>
              </div>
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
                  <p>Are you sure you want to delete this parent?</p>
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
          </>
        </div>
      </div>
    </>
  );
};

export default ShowParents;
