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

const ShowNotices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { noticesList, loading, error, response } = useSelector(
    (state) => state.notice
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllNotices(currentUser._id, "Notice"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllNotices(currentUser._id, "Notice"));
    });
  };

  const noticeColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "details", label: "Details", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const noticeRows =
    noticesList &&
    noticesList.length > 0 &&
    noticesList.map((notice) => {
      const date = new Date(notice.date);
      const dateString =
        date.toString() !== "Invalid Date"
          ? date.toISOString().substring(0, 10)
          : "Invalid Date";
      return {
        title: notice.title,
        details: notice.details,
        date: dateString,
        id: notice._id,
      };
    });

  const NoticeButtonHaver = ({ row }) => {
    return (
      <button
        onClick={() => deleteHandler(row.id, "Notice")}
        className="text-red-500 hover:text-red-700"
      >
        <FiTrash2 />
      </button>
    );
  };

  const actions = [
    {
      icon: <FiPlus className="text-blue-500" />,
      name: "Add New Notice",
      action: () => navigate("/SuperAdmin/addnotice"),
    },
    {
      icon: <FiTrash2 className="text-red-500" />,
      name: "Delete All Notices",
      action: () => deleteHandler(currentUser._id, "Notices"),
    },
  ];

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-screen">
        <div className="flex items-center  justify-between h-16 px-6 border-b border-gray-200">
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
          <>
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            ) : (
              <>
                {response ? (
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => navigate("/SuperAdmin/addnotice")}
                    >
                      Add Notice
                    </button>
                  </div>
                ) : (
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
                )}
              </>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default ShowNotices;
