import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addSubject,
  getAllSclasses,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const AddSubject = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const teacherID = params.id;

  const { status, response, error, currentUser } = useSelector(
    (state) => state.user
  );
  const { sclassesList, subjectsList } = useSelector((state) => state.sclass);

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, "AllSubjects"));
  }, [currentUser._id, dispatch]);
  useEffect(() => {
    dispatch(getAllSclasses(currentUser._id, "Sclass"));
  }, [currentUser._id, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [sclassName, setSclassName] = useState("");
  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [chosenSub, setChosenSub] = useState("");

  const fields = {
    classes: [{ teachSubject: chosenSub, teachSclass: sclassName }],
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addSubject(fields, teacherID));
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
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

  const adminID = currentUser._id;
  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const changeHandler = (event) => {
    if (event.target.value === "Select Class") {
      setClassName("Select Class");
      setSclassName("");
    } else {
      const selectedClass = sclassesList.find(
        (classItem) => classItem._id === event.target.value
      );
      setClassName(selectedClass._id);
      setSclassName(selectedClass._id);
    }
  };

  const changeSubjectHandler = (event) => {
    if (event.target.value === "Select Subject") {
      setSubjectName("Select Subject");
      setChosenSub("");
    } else {
      const selectedSub = subjectsList.find(
        (classItem) => classItem._id === event.target.value
      );
      setSubjectName(selectedSub._id);
      setChosenSub(selectedSub._id);
    }
  };

  return (
    <div className="h-screen font-poppins">
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white shadow-md">
        <button
          onClick={toggleDrawer}
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
        >
          {open ? <IoMdArrowBack size={24} /> : <IoIosMenu size={24} />}
        </button>
        <span className="text-lg font-semibold">Admin Dashboard</span>
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
                Add Subject
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subject</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={subjectName}
                  onChange={changeSubjectHandler}
                  required
                >
                  <option value="Select subject">Select Subject</option>
                  {subjectsList.map((classItem) => (
                    <option key={classItem._id} value={classItem._id}>
                      {classItem.subName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Class</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={className}
                  onChange={changeHandler}
                  required
                >
                  <option value="Select Class">Select Class</option>
                  {sclassesList.map((classItem) => (
                    <option key={classItem._id} value={classItem._id}>
                      {classItem.gradelevel} {classItem.section}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
                type="submit"
                disabled={loader}
              >
                {loader ? (
                  <div className="flex justify-center">loading...</div>
                ) : (
                  "Register"
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
  );
};

export default AddSubject;
