import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosMenu,
  IoMdArrowBack,
} from "react-icons/io";
import { calculateOverallAttendancePercentage } from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import { PurpleButton } from "../../components/ButtonStyles";
import TeacherSideBar from "./TeacherSideBar";
import AccountMenu from "../../components/AccountMenu";

const TeacherViewStudent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { currentUser, userDetails, currentRole, response, loading, error } =
    useSelector((state) => state.user);

  const address = "Student";
  const studentID = params.id;

  useEffect(() => {
    dispatch(getUserDetails(studentID, address));
  }, [dispatch, studentID]);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const [sclassName, setSclassName] = useState("");
  const [studentSchool, setStudentSchool] = useState("");
  const [subjectMarks, setSubjectMarks] = useState("");
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [openStates, setOpenStates] = useState({});

  useEffect(() => {
    if (userDetails) {
      setSclassName(userDetails.sclassName || "");
      setStudentSchool(userDetails.school || "");
      setSubjectMarks(userDetails.examResult || "");
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="h-screen font-poppins bg-gray-100">
      <div className="flex items-center justify-between h-16 px-6 bg-white shadow-md">
        <button
          onClick={toggleDrawer}
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
        >
          {open ? <IoMdArrowBack /> : <IoIosMenu />}
        </button>
        <span className="text-lg font-semibold">Teacher's Dashboard</span>
        <AccountMenu />
      </div>
      <div className="flex h-full">
        <div
          className={`bg-white ${
            open ? "block" : "hidden"
          } lg:block border-r border-gray-200 w-64`}
        >
          <TeacherSideBar />
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-xl font-semibold">Loading...</div>
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-purple-600">
                  {userDetails.firstName} {userDetails.lastName}
                </h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Student ID:</span>{" "}
                    {userDetails.studentID}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Class:</span>{" "}
                    {sclassName.gradelevel} {sclassName.section}
                  </p>
                </div>
                {currentRole === "HomeRoomTeacher" && (
                  <div>
                    <h3 className="text-2xl font-semibold mt-6 text-green-600">
                      Attendance
                    </h3>
                    {subjectAttendance &&
                    Array.isArray(subjectAttendance) &&
                    subjectAttendance.length > 0 ? (
                      <>
                        <div className="mt-4">
                          <div className="flex items-center justify-between">
                            <div className="text-gray-700">
                              <p className="font-semibold">
                                Overall Attendance
                              </p>
                              <p>
                                Present:{" "}
                                {
                                  subjectAttendance.filter(
                                    (att) => att.status === "Present"
                                  ).length
                                }
                              </p>
                              <p>Total Days: {subjectAttendance.length}</p>
                              <p>
                                Attendance Percentage:{" "}
                                {overallAttendancePercentage.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <h4 className="font-semibold">
                              Attendance Details
                            </h4>
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                              <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                  <th className="py-2 px-4 border">Date</th>
                                  <th className="py-2 px-4 border">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {subjectAttendance.map((data, index) => {
                                  const date = new Date(data.date);
                                  const dateString =
                                    date.toString() !== "Invalid Date"
                                      ? date.toISOString().substring(0, 10)
                                      : "Invalid Date";
                                  return (
                                    <tr key={index}>
                                      <td className="border px-4 py-2">
                                        {dateString}
                                      </td>
                                      <td className="border px-4 py-2">
                                        {data.status}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="mt-6">
                          <p className="text-gray-700 font-semibold">
                            Overall Attendance Percentage:{" "}
                            {overallAttendancePercentage.toFixed(2)}%
                          </p>
                          <CustomPieChart data={chartData} />
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-700 mt-4">
                        No attendance records available.
                      </p>
                    )}
                    <PurpleButton
                      onClick={() =>
                        navigate(
                          `/Teacher/class/student/attendance/${studentID}`
                        )
                      }
                      className="bg-gradient-to-r from-green-500 to-green-700 text-white p-2 rounded-sm mt-4"
                    >
                      Add Attendance
                    </PurpleButton>
                  </div>
                )}

                <h3 className="text-2xl font-semibold mt-6 text-blue-600">
                  Subject Marks
                </h3>
                {subjectMarks &&
                Array.isArray(subjectMarks) &&
                subjectMarks.length > 0 ? (
                  subjectMarks.map((result, index) => {
                    return (
                      <div
                        key={index}
                        className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm"
                      >
                        <p className="text-gray-700 mb-2">
                          <span className="font-semibold">Subject:</span>{" "}
                          {result.subName.subName}
                        </p>
                        {result.results.map((res, idx) => (
                          <div key={idx} className="mb-2">
                            <p className="text-gray-700">
                              <span className="font-semibold">Title:</span>{" "}
                              {res.title}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-semibold">Marks:</span>{" "}
                              {res.marks}
                            </p>
                          </div>
                        ))}
                        <p className="underline font-bold text-gray-700">
                          Total Result:{" "}
                          {result?.results?.reduce(
                            (partialSum, a) => partialSum + a.marks,
                            0
                          )}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-700 mt-4">
                    No marks records available.
                  </p>
                )}
                <button
                  onClick={() =>
                    navigate(`/Teacher/class/student/marks/${studentID}`)
                  }
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded-sm mt-4"
                >
                  Add Marks
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherViewStudent;
