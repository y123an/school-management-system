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
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ShowParents = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllParents(currentUser._id));
  }, [currentUser._id, dispatch]);

  const { parentsList, loading, error } = useSelector((state) => state.parent);

  if (error) {
    console.log(error);
  }

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

  const parentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "gender", label: "Gender", minWidth: 170 },
    { id: "phone", label: "Phone", minWidth: 170 },
    { id: "role", label: "Role", minWidth: 170 },
  ];

  const parentRows = parentsList?.map((parent) => ({
    name: parent.name,
    email: parent.email,
    gender: parent.gender,
    phone: parent.phone,
    role: parent.role,
    id: parent._id,
  }));

  const StudentButtonHaver = ({ row }) => {
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
            navigate("/Admin/Parents/update/" + row.id, {
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
      action: () => navigate("/Admin/addParents"),
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

  const downloadPdf = () => {
    const doc = new jsPDF();
    const tableColumn = parentColumns.map((col) => col.label);
    const tableRows = parentRows.map((row) => [
      row.name,
      row.email,
      row.gender,
      row.phone,
      row.role,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 57, 107] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.text("Parent List", 14, 15);
    doc.save("parent_list.pdf");
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
              <div className="flex justify-end mb-4 gap-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition duration-300"
                  onClick={() => navigate("/Admin/addParents")}
                >
                  Add Parent
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                  onClick={downloadPdf}
                >
                  Download PDF
                </button>
                <CSVLink
                  data={parentRows}
                  headers={parentColumns.map((col) => ({
                    label: col.label,
                    key: col.id,
                  }))}
                  filename="parent_list.csv"
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Download CSV
                </CSVLink>
              </div>

              <div className="w-full overflow-hidden">
                {Array.isArray(parentsList) && parentsList.length > 0 && (
                  <TableTemplate
                    buttonHaver={StudentButtonHaver}
                    columns={parentColumns}
                    rows={parentRows}
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
        </div>
      </div>
    </div>
  );
};

export default ShowParents;
