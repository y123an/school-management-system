import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getSubjectDetails,
  updateSubjectFields,
} from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";

import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { underControl } from "../../../redux/sclassRelated/sclassSlice";

const UpdateSubject = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const subjectID = params.id;

  const { status, response, error } = useSelector((state) => state.sclass);

  console.log(state);

  const [subjectName, setSubjectName] = useState(state?.subject.subName);
  const [subjectCode, setSubjectCode] = useState(state?.subject.subCode);
  const [session, setSession] = useState(state?.subject.sessions);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const role = "Teacher";

  const fields = {
    subName: subjectName,
    subCode: subjectCode,
    sessions: session,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateSubjectFields(state?.subject.id, fields, "Subject"));
  };

  useEffect(() => {
    if (status === "success") {
      dispatch(underControl());
      navigate("/Admin/subjects");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-screen font-poppins">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white shadow-md">
          <button
            onClick={toggleDrawer}
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            {open ? <IoMdArrowBack size={24} /> : <IoIosMenu size={24} />}
          </button>
          <span className="text-lg font-semibold">Super Admin Dashboard</span>
          <AccountMenu />
        </div>
        <div className="flex flex-grow">
          <div
            className={`bg-white border-r border-gray-200 ${
              open ? "block" : "hidden"
            } md:block w-64`}
          >
            <SideBar />
          </div>
          <div className="flex flex-col items-center justify-center flex-grow bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <form className="space-y-6" onSubmit={submitHandler}>
                <h2 className="text-2xl font-bold text-center text-gray-800">
                  Update Subject
                </h2>

                <div>
                  <label className="block text-gray-700">Subject Name</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Enter teacher's name..."
                    value={subjectName}
                    onChange={(event) => setSubjectName(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Subject Code</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Enter teacher's name..."
                    value={subjectCode}
                    onChange={(event) => setSubjectCode(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Sessions</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Enter teacher's email..."
                    value={session}
                    onChange={(event) => setSession(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <button
                  className="w-full bg-blue-500 text-white py-3 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
                  type="submit"
                  disabled={loader}
                >
                  {loader ? (
                    <div className="flex justify-center">loading</div>
                  ) : (
                    "Update"
                  )}
                </button>
              </form>
            </div>
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

export default UpdateSubject;
