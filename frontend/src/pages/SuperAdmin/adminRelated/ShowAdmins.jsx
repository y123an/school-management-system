import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAdmins } from "../../../redux/adminRelated/adminHandler";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import TableTemplate from "../../../components/TableTemplate";
import Popup from "../../../components/Popup";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ShowAdmins = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllAdmins(currentUser._id));
  }, [currentUser._id, dispatch]);

  const { adminsList, loading, error } = useSelector((state) => state.admin);

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
      dispatch(getAllAdmins(currentUser._id));
      setShowPopup(true);
      setMessage("Admin deleted successfully!");
    });
    setShowConfirmModal(false);
  };

  const deleteHandler = (deleteID, address) => {
    setDeleteInfo({ deleteID, address });
    setShowConfirmModal(true);
  };

  const adminColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
  ];

  const adminRows =
    adminsList && adminsList.length > 0
      ? adminsList.map((admin) => ({
          name: admin.name,
          email: admin.email,
          id: admin._id,
        }))
      : [];

  const AdminButtonHaver = ({ row }) => (
    <>
      <button
        className="text-red-600 hover:text-red-800"
        onClick={() => {
          deleteHandler(row.id, "Admin");
          dispatch(getAllAdmins(currentUser._id));
        }}
      >
        <MdDelete size={24} />
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        onClick={() =>
          navigate("/SuperAdmin/admins/update/" + row.id, {
            state: { admin: row },
          })
        }
      >
        Update
      </button>
    </>
  );

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
      name: "Add New Admin",
      action: () => navigate("/SuperAdmin/addAdmins"),
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
      name: "Delete All Admins",
      action: () => deleteHandler(currentUser._id, "Admins"),
    },
  ];

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen(!open);

  const downloadPdf = () => {
    const doc = new jsPDF();
    const tableColumn = adminColumns.map((col) => col.label);
    const tableRows = adminRows.map((row) => [row.name, row.email]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 57, 107] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.text("Admin List", 14, 15);
    doc.save("admin_list.pdf");
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
                  onClick={() => navigate("/SuperAdmin/addAdmins")}
                >
                  Add Admin
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                  onClick={downloadPdf}
                >
                  Download PDF
                </button>
                <CSVLink
                  data={adminRows}
                  headers={adminColumns.map((col) => ({
                    label: col.label,
                    key: col.id,
                  }))}
                  filename="admin_list.csv"
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Download CSV
                </CSVLink>
              </div>

              <div className="w-full overflow-hidden">
                {Array.isArray(adminsList) && adminsList.length > 0 && (
                  <TableTemplate
                    buttonHaver={AdminButtonHaver}
                    columns={adminColumns}
                    rows={adminRows}
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
          {showConfirmModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                <p>Are you sure you want to delete this admin?</p>
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

export default ShowAdmins;
