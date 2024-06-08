import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { MdPersonRemove, MdPersonAdd } from "react-icons/md";
import Popup from "../../../components/Popup";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";

const ShowTeachers = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teachersList, loading, error, response } = useSelector(
    (state) => state.teacher
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllTeachers(currentUser._id));
  }, [currentUser._id, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);

  const confirmDelete = () => {
    const { deleteID, address } = deleteInfo;
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllTeachers(currentUser._id));
      setShowPopup(true);
    });
    setShowConfirmModal(false);
  };

  const deleteHandler = (deleteID, address) => {
    setDeleteInfo({ deleteID, address });
    setShowConfirmModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (error) {
    console.log(error);
  }

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "phone", label: "Phone", minWidth: 100 },
    { id: "gender", label: "Gender", minWidth: 100 },
    { id: "role", label: "Role", minWidth: 170 },
  ];

  const rows = teachersList.map((teacher) => ({
    name: teacher.name,
    email: teacher.email,
    phone: teacher.phone,
    gender: teacher.gender,
    role: teacher.role,
    teachSclassID: teacher.classes.teachSclass,
    id: teacher._id,
  }));

  const ActionsTable = () => (
    <table className="min-w-full bg-white border">
      {/* Table Headers */}
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.id}
              className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              {column.label}
            </th>
          ))}
          <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      {/* Table Body */}
      <tbody>
        {rows
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((column) => {
                const value = row[column.id];
                if (column.id === "teachSubject") {
                  return (
                    <td
                      key={column.id}
                      className="px-6 py-4 border-b border-gray-200 text-sm"
                    >
                      {value ? (
                        value
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/Admin/teachers/addSubject/${row.id}`)
                          }
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Add Subject
                        </button>
                      )}
                    </td>
                  );
                }
                return (
                  <td
                    key={column.id}
                    className="px-6 py-4 border-b border-gray-200 text-sm"
                  >
                    {value}
                  </td>
                );
              })}
              <td className="px-6 py-4 border-b border-gray-200 text-center text-sm">
                <button
                  onClick={() => deleteHandler(row.id, "Teacher")}
                  className="text-red-500 hover:text-red-700 mr-2"
                >
                  <MdPersonRemove size={24} />
                </button>
                <button
                  onClick={() => navigate(`/Admin/teachers/teacher/${row.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                  onClick={() =>
                    navigate("/Admin/teacher/update/" + row.id, {
                      state: {
                        teacher: row,
                      },
                    })
                  }
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  const actions = [
    {
      icon: <MdPersonAdd className="text-blue-500" size={24} />,
      name: "Add New Teacher",
      action: () => navigate("/Admin/teachers/chooseclass"),
    },
    {
      icon: <MdPersonRemove className="text-red-500" size={24} />,
      name: "Delete All Teachers",
      action: () => deleteHandler(currentUser._id, "Teachers"),
    },
  ];

  return (
    <>
      <div className="h-screen font-poppins ">
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
          <div className="w-full overflow-hidden p-4">
            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate("/Admin/teachers/addteacher")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Teacher
              </button>
            </div>
            <div className="overflow-x-auto">
              {/* Render Table */}
              <ActionsTable />
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <div className="text-sm text-gray-600">
                Rows per page:
                <select
                  value={rowsPerPage}
                  onChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                  className="ml-2 border border-gray-300 rounded p-1"
                >
                  {[5, 10, 25, 100].map((rowsOption) => (
                    <option key={rowsOption} value={rowsOption}>
                      {rowsOption}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600">
                {page * rowsPerPage + 1}-
                {Math.min((page + 1) * rowsPerPage, rows.length)} of{" "}
                {rows.length}
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="ml-2 p-1"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * rowsPerPage >= rows.length}
                  className="ml-2 p-1"
                >
                  Next
                </button>
              </div>
            </div>
            {/* Popup */}
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
                  <p>Are you sure you want to delete this teacher?</p>
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
    </>
  );
};

export default ShowTeachers;
