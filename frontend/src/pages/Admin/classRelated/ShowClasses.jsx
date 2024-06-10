import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import DataTable from "react-data-table-component";
import {
  FaFileCsv,
  FaFilePdf,
  FaPlus,
  FaPlusCircle,
  FaSpinner,
  FaTrashAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("Done Successfully");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);

  const confirmDelete = () => {
    const { deleteID, address } = deleteInfo;
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllSclasses(adminID, "Sclass"));
      setShowPopup(true);
    });
    setShowConfirmModal(false);
  };

  const deleteHandler = (deleteID, address) => {
    setDeleteInfo({ deleteID, address });
    setShowConfirmModal(true);
  };

  const columns = [
    {
      name: "Class Name",
      selector: (row) => row.name,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Actions",
      cell: (row) => <SclassButtonHaver row={row} />,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "200px",
    },
  ];

  const data =
    sclassesList &&
    sclassesList.length > 0 &&
    sclassesList.map((sclass) => ({
      name: sclass.gradelevel + sclass.section,
      id: sclass._id,
    }));

  const csvData = [
    ["Class Name"],
    ...sclassesList.map((sclass) => [sclass.gradelevel + sclass.section]),
  ];

  const generatePDF = () => {
    // Create a new PDF Document
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text("Class Data", 10, 10);
    doc.autoTable({
      head: [["Class Name"]],
      body: sclassesList.map((sclass) => [sclass.gradelevel + sclass.section]),
      startY: 20,
    });

    // Save the PDF as a blob
    const blob = doc.output("blob");

    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "class_data.pdf";
    a.click();
  };

  const ActionMenu = ({ actions }) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
      setOpen(!open);
    };

    return (
      <div className="relative">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 text-blue-500"
        >
          <span>Add</span>
          <FaPlusCircle />
        </button>
        {open && (
          <div className="absolute right-0 -top-20 w-48 bg-white shadow-lg rounded z-50">
            {actions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="mr-2">{action.icon}</div>
                <div>{action.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SclassButtonHaver = ({ row }) => {
    const actions = [
      {
        icon: <FaPlus />,
        name: "Add Subjects",
        action: () => navigate("/Admin/addsubject/" + row.id),
      },
      {
        icon: <FaUserPlus />,
        name: "Add Student",
        action: () => navigate("/Admin/class/addstudents/" + row.id),
      },
    ];

    return (
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => deleteHandler(row.id, "Sclass")}
          className="text-red-500"
        >
          <FaTrashAlt />
        </button>
        <button
          onClick={() => navigate("/Admin/classes/class/" + row.id)}
          className="bg-blue-500 text-white py-1 px-2 rounded"
        >
          View
        </button>
        <ActionMenu actions={actions} />
      </div>
    );
  };

  return (
    <div className="h-screenfont-poppins bg-gray-100">
      <div className="flex items-center justify-between h-16 px-6 bg-white shadow-md">
        <button className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600">
          <IoIosMenu />
        </button>
        <span className="text-lg font-semibold">Super Admin Dashboard</span>
        <AccountMenu />
      </div>
      <div className="flex h-full">
        <div className="bg-white lg:block border-r border-gray-200 w-64">
          <SideBar />
        </div>
        <div className="flex-grow p-6 relative">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <div className="grid ">
              <div className="flex justify-end mb-4 gap-2">
                <button
                  onClick={() => navigate("/Admin/addclass")}
                  className="bg-green-500 text-white py-1 px-4 rounded"
                >
                  Add Class
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                  onClick={generatePDF}
                >
                  Download PDF
                </button>
                <CSVLink
                  data={csvData}
                  filename="class_list.csv"
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Download CSV
                </CSVLink>
              </div>
              <>
                <div className="">
                  {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                    <DataTable
                      columns={columns}
                      data={data}
                      pagination
                      highlightOnHover
                      responsive
                      customStyles={{
                        headCells: {
                          style: {
                            fontWeight: "bold",
                            backgroundColor: "#f8f9fa",
                          },
                        },
                        rows: {
                          style: {
                            minHeight: "72px",
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </>
            </div>
          )}
          <Popup
            message={message}
            setShowPopup={setShowPopup}
            showPopup={showPopup}
          />
        </div>
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this class?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-black py-1 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white py-1 px-4 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowClasses;
