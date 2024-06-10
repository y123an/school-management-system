import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllNotices } from "../../../redux/noticeRelated/noticeHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import TableTemplate from "../../../components/TableTemplate";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ShowNotices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { noticesList, loading, error } = useSelector((state) => state.notice);
  const { currentUser, currentRole } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllNotices(currentUser._id, "Notice", currentRole));
  }, [currentUser._id, dispatch, currentRole]);

  if (error) {
    console.log(error);
  }

  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const deleteHandler = (deleteID) => {
    setDeleteId(deleteID);
    setShowConfirmationModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteUser(deleteId, "Notice")).then(() => {
      dispatch(getAllNotices(currentUser._id, "Notice", currentRole));
      setDeleteId(null);
      setShowConfirmationModal(false);
    });
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowConfirmationModal(false);
  };

  const noticeColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "details", label: "Details", minWidth: 100 },
    { id: "recipient", label: "Recipient", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const noticeRows =
    noticesList && noticesList.length > 0
      ? noticesList.map((notice) => {
          const date = new Date(notice.date);
          const dateString =
            date.toString() !== "Invalid Date"
              ? date.toISOString().substring(0, 10)
              : "Invalid Date";
          return {
            title: notice.title,
            details: notice.details,
            recipient: notice.recipient,
            date: dateString,
            id: notice._id,
          };
        })
      : [];

  const NoticeButtonHaver = ({ row }) => (
    <button
      onClick={() => deleteHandler(row.id)}
      className="text-red-500 hover:text-red-700"
    >
      <FiTrash2 />
    </button>
  );

  const actions = [
    {
      icon: <FiPlus className="text-blue-500" />,
      name: "Add New Notice",
      action: () => navigate("/SuperAdmin/addnotice"),
    },
    {
      icon: <FiTrash2 className="text-red-500" />,
      name: "Delete All Notices",
      action: () => deleteHandler(currentUser._id),
    },
  ];

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    const tableColumn = noticeColumns.map((col) => col.label);
    const tableRows = noticeRows.map((row) => [
      row.title,
      row.details,
      row.recipient,
      row.date,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 57, 107] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.text("Notice List", 14, 15);
    doc.save("notice_list.pdf");
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
          <div className="bg-white border-b border-gray-200 w-64">
            <SideBar />
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
                    onClick={() => navigate("/SuperAdmin/addnotice")}
                  >
                    Add Notice
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                    onClick={downloadPdf}
                  >
                    Download PDF
                  </button>
                  <CSVLink
                    data={noticeRows}
                    headers={noticeColumns.map((col) => ({
                      label: col.label,
                      key: col.id,
                    }))}
                    filename="notice_list.csv"
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    Download CSV
                  </CSVLink>
                </div>

                <div className="w-full overflow-hidden">
                  {Array.isArray(noticesList) && noticesList.length > 0 && (
                    <TableTemplate
                      buttonHaver={NoticeButtonHaver}
                      columns={noticeColumns}
                      rows={noticeRows}
                    />
                  )}
                  <div className="fixed bottom-4 right-4">
                    <SpeedDialTemplate actions={actions} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showConfirmationModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-700"
                      id="modal-title"
                    >
                      Delete Notice
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this notice? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowNotices;
