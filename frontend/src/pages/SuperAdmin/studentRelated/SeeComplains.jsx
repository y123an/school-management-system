import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllComplains } from "../../../redux/complainRelated/complainHandle";
import { AiOutlineCheckSquare } from "react-icons/ai";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaPrint } from "react-icons/fa";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector(
    (state) => state.complain
  );
  const { currentUser } = useSelector((state) => state.user);
  const printRef = useRef(null);

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

  const handlePrint = async (complain) => {
    const printContainer = document.createElement("div");
    printContainer.style.position = "fixed";
    printContainer.style.top = "-10000px";
    document.body.appendChild(printContainer);

    ReactDOM.render(
      <div className="p-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">{complain.name}</span>
              <span className="text-xs text-gray-500">
                {new Date(complain.date).toISOString().substring(0, 10)}
              </span>
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Role: {complain.role}
          </div>
          <h1 className="font-bold"> {complain.title}</h1>
          <p className="mt-2 text-gray-800 text-sm">{complain.complaint}</p>
        </div>
      </div>,
      printContainer
    );

    await html2canvas(printContainer, { useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF();
        doc.addImage(imgData, "PNG", 10, 10);
        doc.save("complain.pdf");
      })
      .catch((err) => {
        console.error("Error generating PDF: ", err);
      })
      .finally(() => {
        document.body.removeChild(printContainer);
      });
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
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handlePrint(complain)}
                                  className="text-blue-600"
                                >
                                  <FaPrint />
                                </button>
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
      <div ref={printRef} style={{ display: "none" }}></div>
    </>
  );
};

export default SeeComplains;
