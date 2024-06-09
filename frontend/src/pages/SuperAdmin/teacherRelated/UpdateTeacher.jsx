import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAllSclasses,
  getSubjectDetails,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { updateTeacherFields } from "../../../redux/teacherRelated/teacherHandle";
import { underTeacherControl } from "../../../redux/teacherRelated/teacherSlice";

const UpdateTeacher = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subjectID = params.id;
  const { currentUser } = useSelector((state) => state.user);

  const { status, response, error } = useSelector((state) => state.teacher);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  // useEffect(() => {
  //   dispatch(getSubjectList(currentUser._id, "AllSubjects"));
  // }, [currentUser._id, dispatch]);

  useEffect(() => {
    dispatch(getAllSclasses(currentUser._id, "Sclass"));
  }, [currentUser._id, dispatch]);

  const { state } = useLocation();

  const [name, setName] = useState(state?.teacher.name);
  const [email, setEmail] = useState(state?.teacher.email);
  const [gender, setGender] = useState(state?.teacher.gender);
  const [phone, setPhone] = useState(state?.teacher.phone);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const fields = {
    name,
    email,
    phone,
    gender,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateTeacherFields(state?.teacher.id, fields, "Teacher"));
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underTeacherControl());
      navigate("/SuperAdmin/teachers");
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
                  Update Teacher
                </h2>

                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Enter teacher's name..."
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Gender</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="Select Class">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700">Phone</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    placeholder="Enter phone name..."
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Enter teacher's email..."
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
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

export default UpdateTeacher;
