import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;
  const { sclassesList } = useSelector((state) => state.sclass);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grandfathersName, setGrandfathersName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const [sclassName, setSclassName] = useState("");

  const adminID = currentUser._id;
  const role = "Student";
  const examResult = [];
  const attendance = [];

  useEffect(() => {
    if (situation === "Class") {
      setSclassName(params.id);
    }
  }, [params.id, situation]);

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
      console.log(selectedClass);
      setClassName(selectedClass._id);
      setSclassName(selectedClass._id);
    }
  };

  const fields = {
    firstName,
    lastName,
    grandfathersName,
    studentID,
    sclassName,
    className:
      sclassesList.find((classItem) => classItem._id === className)
        ?.gradelevel +
      sclassesList.find((classItem) => classItem._id === className)?.section,
    adminID,
    role,
    examResult,
    attendance,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (sclassName === "") {
      setShowPopup(true);
      setMessage("Please select a class.");
    } else {
      dispatch(registerUser(fields, role));
      setLoader(true);
    }
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate(-1);
    } else if (status === "failed") {
      setShowPopup(true);
      setMessage(response);
      setLoader(false);
    } else if (status === "error") {
      setShowPopup(true);
      setMessage("Network Error");
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-screen flex flex-col font-poppins">
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
        <div className="flex">
          <SideBar />
          <div className="flex-grow flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Add Student
              </h2>
              <form onSubmit={submitHandler}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">First Name</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Enter student's first name..."
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Last Name</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Enter student's last name..."
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Grandfather's Name
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Enter student's grandfather's name..."
                    value={grandfathersName}
                    onChange={(event) =>
                      setGrandfathersName(event.target.value)
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Student ID</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    placeholder="Enter student's ID..."
                    value={studentID}
                    onChange={(event) => setStudentID(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Class</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="flex items-center justify-center">
                  <button
                    className={`w-full bg-blue-500 text-white py-2 px-4 rounded focus:outline-none ${
                      loader ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    type="submit"
                    disabled={loader}
                  >
                    {loader ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
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

export default AddStudent;
