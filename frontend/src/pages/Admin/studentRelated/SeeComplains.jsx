import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllComplains } from "../../../redux/complainRelated/complainHandle";
import TableTemplate from "../../../components/TableTemplate";
import { AiOutlineCheckSquare } from "react-icons/ai";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector(
    (state) => state.complain
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.error(error);
  }

  const complainColumns = [
    { id: "user", label: "User", minWidth: 170 },
    { id: "complaint", label: "Complaint", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const complainRows =
    complainsList &&
    complainsList.length > 0 &&
    complainsList.map((complain) => {
      const date = new Date(complain.date);
      const dateString =
        date.toString() !== "Invalid Date"
          ? date.toISOString().substring(0, 10)
          : "Invalid Date";
      return {
        user: complain.user.name,
        complaint: complain.complaint,
        date: dateString,
        id: complain._id,
      };
    });

  const ComplainButtonHaver = ({ row }) => {
    return (
      <div className="text-xl text-green-600">
        <AiOutlineCheckSquare />
      </div>
    );
  };

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
          <span className="text-lg font-semibold">Admin Dashboard</span>

          <AccountMenu />
        </div>
        <div className="flex h-screen">
          <div className="bg-white border-b border-gray-200 w-64">
            <SideBar />
          </div>
          <>
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <div className="text-2xl">Loading...</div>
              </div>
            ) : (
              <>
                {response ? (
                  <div className="flex justify-end mt-4">
                    <div className="text-lg">No Complaints Right Now</div>
                  </div>
                ) : (
                  <div className="w-full overflow-hidden">
                    {Array.isArray(complainsList) &&
                      complainsList.length > 0 && (
                        <TableTemplate
                          buttonHaver={ComplainButtonHaver}
                          columns={complainColumns}
                          rows={complainRows}
                        />
                      )}
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

export default SeeComplains;
