import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  getUserDetails,
  updateUser,
} from "../../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import {
  removeStuff,
  updateStudentFields,
} from "../../../redux/studentRelated/studentHandle";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../../components/attendanceCalculator";
import CustomBarChart from "../../../components/CustomBarChart";
import CustomPieChart from "../../../components/CustomPieChart";
import Popup from "../../../components/Popup";

import { FiArrowUp, FiArrowDown, FiTrash } from "react-icons/fi";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const ViewStudent = () => {
  const [showTab, setShowTab] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { userDetails, response, loading, error } = useSelector(
    (state) => state.user
  );

  const studentID = params.id;
  const address = "Student";

  useEffect(() => {
    dispatch(getUserDetails(studentID, address));
  }, [dispatch, studentID]);

  useEffect(() => {
    if (
      userDetails &&
      userDetails.sclassName &&
      userDetails.sclassName._id !== undefined
    ) {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [sclassName, setSclassName] = useState("");
  const [studentSchool, setStudentSchool] = useState("");
  const [subjectMarks, setSubjectMarks] = useState("");
  const [subjectAttendance, setSubjectAttendance] = useState([]);

  const [openStates, setOpenStates] = useState({});

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState("table");
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const fields =
    password === "" ? { name, rollNum } : { name, rollNum, password };

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setRollNum(userDetails.rollNum || "");
      setSclassName(userDetails.sclassName || "");
      setStudentSchool(userDetails.school || "");
      setSubjectMarks(userDetails.examResult || "");
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUser(fields, studentID, address))
      .then(() => {
        dispatch(getUserDetails(studentID, address));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteHandler = () => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);

    // dispatch(deleteUser(studentID, address))
    //     .then(() => {
    //         navigate(-1)
    //     })
  };

  const removeHandler = (id, deladdress) => {
    dispatch(removeStuff(id, deladdress)).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  const removeSubAttendance = (subId) => {
    dispatch(
      updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten")
    ).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const subjectData = Object.entries(
    groupAttendanceBySubject(subjectAttendance)
  ).map(([subName, { subCode, present, sessions }]) => {
    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
      present,
      sessions
    );
    return {
      subject: subName,
      attendancePercentage: subjectAttendancePercentage,
      totalClasses: sessions,
      attendedClasses: present,
    };
  });

  const StudentAttendanceSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3>Attendance:</h3>
          <table className="border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400">Subject</th>
                <th className="border border-gray-400">Present</th>
                <th className="border border-gray-400">Total Sessions</th>
                <th className="border border-gray-400">
                  Attendance Percentage
                </th>
                <th className="border border-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
                ([subName, { present, allData, subId, sessions }], index) => {
                  const subjectAttendancePercentage =
                    calculateSubjectAttendancePercentage(present, sessions);
                  return (
                    <tr key={index}>
                      <td className="border border-gray-400">{subName}</td>
                      <td className="border border-gray-400">{present}</td>
                      <td className="border border-gray-400">{sessions}</td>
                      <td className="border border-gray-400">
                        {subjectAttendancePercentage}%
                      </td>
                      <td className="border border-gray-400 text-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                          onClick={() => handleOpen(subId)}
                        >
                          {openStates[subId] ? <FiArrowUp /> : <FiArrowDown />}
                          Details
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 ml-2"
                          onClick={() => removeSubAttendance(subId)}
                        >
                          <FiTrash />
                        </button>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2"
                          onClick={() =>
                            navigate(
                              `/SuperAdmin/subject/student/attendance/${studentID}/${subId}`
                            )
                          }
                        >
                          Change
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
          <div>
            Overall Attendance Percentage:{" "}
            {overallAttendancePercentage.toFixed(2)}%
          </div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
          >
            Delete All
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 ml-2"
            onClick={() =>
              navigate("/SuperAdmin/students/student/attendance/" + studentID)
            }
          >
            Add Attendance
          </button>
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart
            chartData={subjectData}
            dataKey="attendancePercentage"
          />
        </>
      );
    };
    return (
      <>
        {subjectAttendance &&
        Array.isArray(subjectAttendance) &&
        subjectAttendance.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

            <div className="fixed bottom-0 left-0 right-0">
              <div className="bg-white shadow-md">
                <button
                  className={`py-2 px-4 rounded-l ${
                    selectedSection === "table"
                      ? "bg-blue-500 text-white"
                      : "text-blue-500"
                  }`}
                  onClick={() => handleSectionChange(null, "table")}
                >
                  Table
                </button>
                <button
                  className={`py-2 px-4 rounded-r ${
                    selectedSection === "chart"
                      ? "bg-blue-500 text-white"
                      : "text-blue-500"
                  }`}
                  onClick={() => handleSectionChange(null, "chart")}
                >
                  Chart
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              navigate("/SuperAdmin/students/student/attendance/" + studentID)
            }
          >
            Add Attendance
          </button>
        )}
      </>
    );
  };

  const StudentMarksSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3>Subject Marks:</h3>
          <table className="border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400">Subject</th>
                <th className="border border-gray-400">Marks</th>
              </tr>
            </thead>
            <tbody>
              {subjectMarks.map((result, index) => {
                if (!result.subName || !result.marksObtained) {
                  return null;
                }
                return (
                  <tr key={index}>
                    <td className="border border-gray-400">
                      {result.subName.subName}
                    </td>
                    <td className="border border-gray-400">
                      {result.marksObtained}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={() =>
              navigate("/SuperAdmin/students/student/marks/" + studentID)
            }
          >
            Add Marks
          </button>
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
        </>
      );
    };
    return (
      <>
        {subjectMarks &&
        Array.isArray(subjectMarks) &&
        subjectMarks.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

            <div className="fixed bottom-0 left-0 right-0">
              <div className="bg-white shadow-md">
                <button
                  className={`py-2 px-4 rounded-l ${
                    selectedSection === "table"
                      ? "bg-blue-500 text-white"
                      : "text-blue-500"
                  }`}
                  onClick={() => handleSectionChange(null, "table")}
                >
                  Table
                </button>
                <button
                  className={`py-2 px-4 rounded-r ${
                    selectedSection === "chart"
                      ? "bg-blue-500 text-white"
                      : "text-blue-500"
                  }`}
                  onClick={() => handleSectionChange(null, "chart")}
                >
                  Chart
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              navigate("/SuperAdmin/students/student/marks/" + studentID)
            }
          >
            Add Marks
          </button>
        )}
      </>
    );
  };

  const StudentDetailsSection = () => {
    return (
      <div>
        Name: {userDetails.name}
        <br />
        Roll Number: {userDetails.rollNum}
        <br />
        Class: {sclassName.sclassName}
        <br />
        School: {studentSchool.schoolName}
        {subjectAttendance &&
          Array.isArray(subjectAttendance) &&
          subjectAttendance.length > 0 && <CustomPieChart data={chartData} />}
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={deleteHandler}
        >
          Delete
        </button>
        <br />
      </div>
    );
  };

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
            <SideBar />
          </div>
          <>
            {loading ? (
              <>
                <div>Loading...</div>
              </>
            ) : (
              <>
                <div className="w-full">
                  <div className="border-b border-gray-200">
                    <div className="flex bg-white shadow-md">
                      <button
                        className={`py-2 px-4 ${
                          value === "1"
                            ? "bg-blue-500 text-white"
                            : "text-blue-500"
                        }`}
                        onClick={() => setValue("1")}
                      >
                        Details
                      </button>
                      <button
                        className={`py-2 px-4 ${
                          value === "2"
                            ? "bg-blue-500 text-white"
                            : "text-blue-500"
                        }`}
                        onClick={() => setValue("2")}
                      >
                        Attendance
                      </button>
                      <button
                        className={`py-2 px-4 ${
                          value === "3"
                            ? "bg-blue-500 text-white"
                            : "text-blue-500"
                        }`}
                        onClick={() => setValue("3")}
                      >
                        Marks
                      </button>
                    </div>
                  </div>
                  <div className="mt-12 mb-16">
                    {value === "1" && <StudentDetailsSection />}
                    {value === "2" && <StudentAttendanceSection />}
                    {value === "3" && <StudentMarksSection />}
                  </div>
                </div>
              </>
            )}
            <Popup
              message={message}
              setShowPopup={setShowPopup}
              showPopup={showPopup}
            />
          </>
        </div>
      </div>
    </>
  );
};

export default ViewStudent;
