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
  AdminFields,
} from "../../../redux/studentRelated/studentHandle";
import { calculateOverallAttendancePercentage } from "../../../components/attendanceCalculator";
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
    dispatch(AdminFields(studentID, { subId }, "RemoveStudentSubAtten")).then(
      () => {
        dispatch(getUserDetails(studentID, address));
      }
    );
  };

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  console.log(userDetails);
  const StudentAttendanceSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3 className="text-xl font-semibold mb-4">Attendance:</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">status</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.attendance.map((attendance) => {
                return (
                  <tr key={attendance._id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {attendance.date.slice(0, 10)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {attendance.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4 text-lg">
            Overall Attendance Percentage:{" "}
            {overallAttendancePercentage.toFixed(2)}%
          </div>
          {/* <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
            onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
          >
            Delete All
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2 transition duration-300"
            onClick={() =>
              navigate("/SuperAdmin/students/student/attendance/" + studentID)
            }
          >
            Add Attendance
          </button> */}
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <h3 className="text-xl font-semibold mb-4">Attendance Chart:</h3>
          <CustomBarChart
            chartData={chartData}
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
          <div></div>
          // <button
          //   className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          //   onClick={() =>
          //     navigate("/SuperAdmin/students/student/attendance/" + studentID)
          //   }
          // >
          //   Add Attendance
          // </button>
        )}
      </>
    );
  };

  const StudentMarksSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3 className="text-xl font-semibold mb-4">Subject Marks:</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Subject</th>
                <th className="border border-gray-300 px-4 py-2">Marks</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.examResult?.map((result) => {
                return (
                  <tr key={result._id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {result.subName.subName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {result?.results?.map((res) => {
                        return (
                          <div key={res._id} className="flex gap-2">
                            <p>- {res.title}:</p>
                            <p>{res.marks}</p>
                          </div>
                        );
                      })}
                      <p className="underline font-bold">
                        Total Result:{"  "}
                        {result?.results?.reduce(
                          (partialSum, a) => partialSum + a.marks,
                          0
                        )}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
            onClick={() =>
              navigate("/SuperAdmin/students/student/marks/" + studentID)
            }
          >
            Add Marks
          </button> */}
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <h3 className="text-xl font-semibold mb-4">Marks Chart:</h3>
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
          <div></div>
          // <button
          //   className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          //   onClick={() =>
          //     navigate("/SuperAdmin/students/student/marks/" + studentID)
          //   }
          // >
          //   Add Marks
          // </button>
        )}
      </>
    );
  };

  const StudentDetailsSection = () => {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Student Details:</h3>
        <div className="mb-2">
          <span className="font-semibold">First Name:</span>{" "}
          {userDetails.firstName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Last Name:</span>{" "}
          {userDetails.lastName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Grand Father Name:</span>{" "}
          {userDetails.grandfathersName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Class:</span> {userDetails.className}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Student ID:</span>{" "}
          {userDetails.studentID}
        </div>
        {subjectAttendance &&
          Array.isArray(subjectAttendance) &&
          subjectAttendance.length > 0 && <CustomPieChart data={chartData} />}
        {/* <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
          onClick={deleteHandler}
        >
          Delete
        </button> */}
      </div>
    );
  };

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="h-screen font-poppins bg-gray-100">
      <div className="flex items-center justify-between h-16 px-6 bg-white shadow-md">
        <button
          onClick={toggleDrawer}
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition duration-300"
        >
          {open ? <IoMdArrowBack /> : <IoIosMenu />}
        </button>
        <span className="text-lg font-semibold">Super Admin Dashboard</span>
        <AccountMenu />
      </div>
      <div className="flex h-full">
        <div
          className={`bg-white shadow-md transition-transform ${
            open ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <SideBar />
        </div>
        <div className="flex-grow p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-xl font-semibold">Loading...</div>
            </div>
          ) : (
            <>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`py-2 px-4 w-1/3 ${
                      value === "1" ? "bg-blue-500 text-white" : "text-blue-500"
                    }`}
                    onClick={() => setValue("1")}
                  >
                    Details
                  </button>
                  <button
                    className={`py-2 px-4 w-1/3 ${
                      value === "2" ? "bg-blue-500 text-white" : "text-blue-500"
                    }`}
                    onClick={() => setValue("2")}
                  >
                    Attendance
                  </button>
                  <button
                    className={`py-2 px-4 w-1/3 ${
                      value === "3" ? "bg-blue-500 text-white" : "text-blue-500"
                    }`}
                    onClick={() => setValue("3")}
                  >
                    Marks
                  </button>
                </div>
                <div className="p-6">
                  {value === "1" && <StudentDetailsSection />}
                  {value === "2" && <StudentAttendanceSection />}
                  {value === "3" && <StudentMarksSection />}
                </div>
              </div>
              <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
