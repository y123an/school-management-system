import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllComplains } from "../../../redux/complainRelated/complainHandle";
import { AiOutlineCheckSquare } from "react-icons/ai";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import axios from "axios";

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

  const [open, setOpen] = useState(false);
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
          <div className="bg-white border-r border-gray-200 w-64">
            <SideBar />
          </div>
          <div className="flex-grow p-6 overflow-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-2xl">Loading...</div>
              </div>
            ) : (
              <>
                {response ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-lg">No Complaints Right Now</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(complainsList) &&
                      complainsList.length > 0 &&
                      complainsList.map((complain) => {
                        const date = new Date(complain.date);
                        const dateString =
                          date.toString() !== "Invalid Date"
                            ? date.toISOString().substring(0, 10)
                            : "Invalid Date";
                        return (
                          <div
                            key={complain._id}
                            className="bg-white shadow rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-semibold">
                                  {complain.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {dateString}
                                </span>
                              </div>
                              <button
                                onClick={async () => {
                                  await axios
                                    .delete(
                                      `http://localhost:4000/Complain/${complain._id}`,
                                      {
                                        headers: {
                                          "Content-Type": "application/json",
                                          Authorization: `Bearer ${localStorage.getItem(
                                            "token"
                                          )}`,
                                        },
                                      }
                                    )
                                    .then((res) => {
                                      dispatch(
                                        getAllComplains(
                                          currentUser._id,
                                          "Complain"
                                        )
                                      );
                                    });
                                }}
                                className="text-green-600"
                              >
                                <MdDelete />
                              </button>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              Role: {complain.role}
                            </div>
                            <h1 className="font-bold"> {complain.title}</h1>
                            <p className="mt-2 text-gray-800">
                              {complain.complaint}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SeeComplains;
