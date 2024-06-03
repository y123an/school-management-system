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

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.");

    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllTeachers(currentUser._id));
    });
    setShowPopup(true);
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
    { id: "teachSubject", label: "Subject", minWidth: 100 },
    { id: "teachSclass", label: "Class", minWidth: 170 },
  ];

  console.log(teachersList);
  const rows = teachersList.map((teacher) => ({
    name: teacher.name,
    teachSubject: teacher.classes.teachSubject?.subName || null,
    teachSclass: teacher.classes.teachSclass,
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
                            navigate(
                              `/SuperAdmin/teachers/addSubject/${row.id}`
                            )
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
                  onClick={() =>
                    navigate(`/SuperAdmin/teachers/teacher/${row.id}`)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View
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
      action: () => navigate("/SuperAdmin/teachers/chooseclass"),
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
                onClick={() => navigate("/SuperAdmin/teachers/addteacher")}
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
            {/* Action Buttons */}
            <div className="fixed bottom-16 right-16">
              {actions.map((action) => (
                <div key={action.name} className="mb-4">
                  <button
                    onClick={action.action}
                    className="bg-white shadow-md rounded-full p-3"
                  >
                    {action.icon}
                  </button>
                </div>
              ))}
            </div>
            {/* Popup */}
            <Popup
              message={message}
              setShowPopup={setShowPopup}
              showPopup={showPopup}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowTeachers;
