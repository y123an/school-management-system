import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import { updateStudentFields } from "../../redux/studentRelated/studentHandle";
import Popup from "../../components/Popup";
import AccountMenu from "../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import TeacherSideBar from "./TeacherSideBar";

const StudentAttendance = ({ situation }) => {
  const dispatch = useDispatch();
  const { currentUser, userDetails, loading } = useSelector(
    (state) => state.user
  );
  const { subjectsList } = useSelector((state) => state.sclass);
  const { response, error, statestatus } = useSelector(
    (state) => state.student
  );
  const params = useParams();

  const [studentID, setStudentID] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [chosenSubName, setChosenSubName] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (situation === "Student") {
      setStudentID(params.studentID);
      const stdID = params.studentID;
      dispatch(getUserDetails(stdID, "Student"));
    } else if (situation === "Subject") {
      const { studentID, subjectID } = params;
      setStudentID(studentID);
      dispatch(getUserDetails(studentID, "Student"));
      setChosenSubName(subjectID);
    }
  }, [situation]);

  useEffect(() => {
    if (userDetails && userDetails.sclassName && situation === "Student") {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  const changeHandler = (event) => {
    const selectedSubject = subjectsList.find(
      (subject) => subject.subName === event.target.value
    );
    setSubjectName(selectedSubject.subName);
    setChosenSubName(selectedSubject._id);
  };

  const fields = { subName: chosenSubName, status, date };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateStudentFields(studentID, fields, "StudentAttendance"));
  };

  useEffect(() => {
    if (response) {
      setLoader(false);
      setShowPopup(true);
      setMessage(response);
    } else if (error) {
      setLoader(false);
      setShowPopup(true);
      setMessage("error");
    } else if (statestatus === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    }
  }, [response, statestatus, error]);

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-screen font-poppins">
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
            <TeacherSideBar />
          </div>
          <>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="flex items-center justify-center flex-1">
                <div className="max-w-lg px-4 py-24 w-full">
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold mb-2">
                      Student Name: {userDetails.name}
                    </h4>
                    {currentUser.teachSubject && (
                      <h4 className="text-2xl font-bold mb-2">
                        Subject Name: {currentUser.teachSubject?.subName}
                      </h4>
                    )}
                  </div>
                  <form onSubmit={submitHandler}>
                    <div className="space-y-6">
                      {situation === "Student" && (
                        <div className="w-full">
                          <label
                            htmlFor="subject-select"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Select Subject
                          </label>
                          <select
                            id="subject-select"
                            value={subjectName}
                            onChange={changeHandler}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                          >
                            {subjectsList ? (
                              subjectsList.map((subject, index) => (
                                <option key={index} value={subject.subName}>
                                  {subject.subName}
                                </option>
                              ))
                            ) : (
                              <option value="">
                                Add Subjects For Attendance
                              </option>
                            )}
                          </select>
                        </div>
                      )}
                      <div className="w-full">
                        <label
                          htmlFor="status-select"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Attendance Status
                        </label>
                        <select
                          id="status-select"
                          value={status}
                          onChange={(event) => setStatus(event.target.value)}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="date-select"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Select Date
                        </label>
                        <input
                          id="date-select"
                          type="date"
                          value={date}
                          onChange={(event) => setDate(event.target.value)}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    <button className="bg-blue-500 p-3 text-white rounded-md mt-4">
                      {loader ? "loading..." : "Submit"}
                    </button>
                  </form>
                </div>
                <Popup
                  message={message}
                  setShowPopup={setShowPopup}
                  showPopup={showPopup}
                />
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default StudentAttendance;
