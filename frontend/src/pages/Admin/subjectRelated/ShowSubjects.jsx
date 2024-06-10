import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import {
  FaPlus,
  FaTrash,
  FaSpinner,
  FaFilePdf,
  FaFileCsv,
} from "react-icons/fa";
import TableTemplate from "../../../components/TableTemplate";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";

const ShowSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList, loading, error, response } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, "AllSubjects"));
  }, [currentUser._id, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);

  const confirmDelete = () => {
    const { deleteID, address } = deleteInfo;
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getSubjectList(currentUser._id, "AllSubjects"));
      setShowPopup(true);
    });
    setShowConfirmModal(false);
  };

  const deleteHandler = (deleteID, address) => {
    setDeleteInfo({ deleteID, address });
    setShowConfirmModal(true);
  };

  const subjectColumns = [
    { id: "subName", label: "Sub Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "sclassName", label: "Class", minWidth: 170 },
  ];

  const subjectRows = subjectsList.map((subject) => ({
    subName: subject.subName,
    sessions: subject.sessions,
    subCode: subject.subCode,
    sclassName: subject.sclassName.gradelevel + subject.sclassName.section,
    sclassID: subject.sclassName._id,
    id: subject._id,
  }));

  const SubjectsButtonHaver = ({ row }) => (
    <div className="flex space-x-2">
      <button
        onClick={() => deleteHandler(row.id, "Subject")}
        className="text-red-600 hover:text-red-800"
      >
        <FaTrash />
      </button>
      <button
        onClick={() =>
          navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)
        }
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        onClick={() =>
          navigate("/Admin/subject/update/" + row.id, {
            state: {
              subject: row,
            },
          })
        }
      >
        Update
      </button>
    </div>
  );

  const actions = [
    {
      icon: <FaPlus className="text-blue-500" />,
      name: "Add New Subject",
      action: () => navigate("/Admin/subjects/chooseclass"),
    },
    {
      icon: <FaTrash className="text-red-500" />,
      name: "Delete All Subjects",
      action: () => deleteHandler(currentUser._id, "Subjects"),
    },
  ];
  const headers = ["Subject Name", "Sessions", "Subject Code", "Class", "id"];
  const csvData = [headers, ...subjectRows.map((row) => Object.values(row))];

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Subject Data", 10, 10);
    let yPos = 20;
    doc.autoTable({
      head: [["Subject Name", "Sessions", "Class"]],
      body: subjectsList.map((subject) => [
        subject.subName,
        subject.sessions,
        `${subject.sclassName.gradelevel}${subject.sclassName.section}`,
      ]),
      startY: yPos,
    });
    doc.save("subjects_data.pdf");
  };

  return (
    <>
      <div className="h-screen flex font-poppins">
        <div className="w-64 bg-white border-r border-gray-200">
          <SideBar />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center h-16 px-6 border-b border-gray-200">
            <button
              onClick={toggleDrawer}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              {open ? <IoMdArrowBack /> : <IoIosMenu />}
            </button>
            <span className="text-lg font-semibold">Admin Dashboard</span>
            <AccountMenu />
          </div>
          <div className="flex flex-col flex-1 px-6 pt-6">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <FaSpinner className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4 gap-2">
                  <button
                    onClick={() => navigate("/Admin/subjects/chooseclass")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Add Subjects
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                    onClick={downloadPDF}
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
                <div className="w-full overflow-hidden">
                  {Array.isArray(subjectsList) && subjectsList.length > 0 && (
                    <TableTemplate
                      buttonHaver={SubjectsButtonHaver}
                      columns={subjectColumns}
                      rows={subjectRows}
                    />
                  )}
                  <SpeedDialTemplate actions={actions} />
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
      {showConfirmModal && (
        <div className="fixed inset-0 font-poppins flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg ">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this subject?</p>
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
    </>
  );
};

export default ShowSubjects;
