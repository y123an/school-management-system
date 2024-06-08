import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import { updateStudentFields } from "../../redux/studentRelated/studentHandle";

import Popup from "../../components/Popup";
import { BlueButton } from "../../components/ButtonStyles";
import { MdOutlineSubject, MdOutlinePerson } from "react-icons/md";
import AccountMenu from "../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import TeacherSideBar from "./TeacherSideBar";

const StudentExamMarks = ({ situation }) => {
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
  const [chosenSubject, setChosenSubject] = useState("");
  const [results, setResults] = useState([]);
  const [loader, setLoader] = useState(false);
  const [ChosenSubName, setChosenSubName] = useState("");
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    if (situation === "Student") {
      setStudentID(params.studentID);
      const stdID = params.id;
      dispatch(getUserDetails(stdID, "Student"));
    } else if (situation === "Subject") {
      const { studentID, subjectID } = params;
      setStudentID(studentID);
      dispatch(getUserDetails(studentID, "Student"));
      setChosenSubject(subjectID);
    }
  }, [situation]);

  useEffect(() => {
    if (userDetails && userDetails.sclassName && situation === "Student") {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  const changeHandler = (event) => {
    if (event.target.value === "") {
      setSubjectName("");
      setChosenSubName("");
      return;
    }
    const selectedSubject = subjectsList.find(
      (subject) => subject.subName === event.target.value
    );
    setSubjectName(selectedSubject.subName);
    setChosenSubName(selectedSubject._id); // Store the ID of the selected subject
  };

  const addResult = () => {
    setResults([...results, { title: "", marks: 0 }]);
  };

  const removeResult = (index) => {
    const updatedResults = [...results];
    updatedResults.splice(index, 1);
    setResults(updatedResults);
  };

  const updateResult = (index, key, value) => {
    const updatedResults = [...results];
    updatedResults[index][key] = value;
    setResults(updatedResults);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);

    // Send the request with the adjusted body
    dispatch(
      updateStudentFields(
        studentID,
        { subName: ChosenSubName, results },
        "UpdateExamResult"
      )
    );
  };

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

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

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  console.log(currentUser);

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
            <div
              className={`bg-white shadow-md transition-transform ${
                open ? "w-64" : "w-0"
              } overflow-hidden`}
            >
              <TeacherSideBar />
            </div>
          </div>
          <>
            {loading ? (
              <div className="flex items-center justify-center h-screen">
                loading...
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1">
                <div className="max-w-lg px-4 py-24 w-full">
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold mb-2 flex items-center">
                      <MdOutlinePerson className="mr-2" /> Student Name:{" "}
                      {userDetails.firstName + " " + userDetails.lastName}
                    </h4>
                    {currentUser.teachSubject && (
                      <h4 className="text-2xl font-bold mb-2 flex items-center">
                        <MdOutlineSubject className="mr-2" /> Subject Name:{" "}
                        {currentUser.teachSubject?.subName}
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
                            <option value=""></option>
                            {subjectsList &&
                              subjectsList.map((subject, index) => (
                                <option key={index} value={subject.subName}>
                                  {subject.subName}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-semibold mb-2">
                          Exam Results
                        </h4>
                        {results.map((result, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="text"
                              value={result.title}
                              onChange={(e) =>
                                updateResult(index, "title", e.target.value)
                              }
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Result Title"
                              required
                            />
                            <input
                              type="number"
                              value={result.marks}
                              onChange={(e) =>
                                updateResult(index, "marks", e.target.value)
                              }
                              className="mt-1 ml-2 block w-100 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Marks Obtained"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => removeResult(index)}
                              className="ml-2 p-2 text-red-500 focus:outline-none"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addResult}
                          className="mt-2 p-2 text-blue-500 focus:outline-none"
                        >
                          Add Result
                        </button>
                      </div>
                    </div>
                    <BlueButton
                      fullWidth
                      size="large"
                      className="mt-6 bg-blue-600 text-white p-2 rounded-md"
                      variant="contained"
                      type="submit"
                      disabled={loader}
                    >
                      {loader ? "loading..." : "Submit"}
                    </BlueButton>
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

export default StudentExamMarks;
