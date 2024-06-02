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
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import { PurpleButton } from "../../components/ButtonStyles";
import TeacherSideBar from "./TeacherSideBar";
import AccountMenu from "../../components/AccountMenu";

const TeacherViewStudent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { currentUser, userDetails, response, loading, error } = useSelector(
    (state) => state.user
  );

  const address = "Student";
  const studentID = params.id;
  const teachSubject = currentUser.teachSubject?.subName;
  const teachSubjectID = currentUser.teachSubject?._id;

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

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

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
        <span className="text-lg font-semibold">Teachers Dashboard</span>
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
        <>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  <div>
                    Name: {userDetails.name}
                    <br />
                    Roll Number: {userDetails.rollNum}
                    <br />
                    Class: {sclassName.sclassName}
                    <br />
                    School: {studentSchool.schoolName}
                    <br />
                    <br />
                    <h3>Attendance:</h3>
                    {subjectAttendance &&
                      Array.isArray(subjectAttendance) &&
                      subjectAttendance.length > 0 && (
                        <>
                          {Object.entries(
                            groupAttendanceBySubject(subjectAttendance)
                          ).map(
                            (
                              [subName, { present, allData, subId, sessions }],
                              index
                            ) => {
                              if (subName === teachSubject) {
                                const subjectAttendancePercentage =
                                  calculateSubjectAttendancePercentage(
                                    present,
                                    sessions
                                  );

                                return (
                                  <div key={index}>
                                    <div>
                                      <div>Subject: {subName}</div>
                                      <div>Present: {present}</div>
                                      <div>Total Sessions: {sessions}</div>
                                      <div>
                                        Attendance Percentage:{" "}
                                        {subjectAttendancePercentage}%
                                      </div>
                                      <div>
                                        <button
                                          onClick={() => handleOpen(subId)}
                                        >
                                          {openStates[subId] ? (
                                            <IoIosArrowUp />
                                          ) : (
                                            <IoIosArrowDown />
                                          )}
                                          Details
                                        </button>
                                      </div>
                                      <div>
                                        {openStates[subId] && (
                                          <div>
                                            <h6>Attendance Details</h6>
                                            <table>
                                              <thead>
                                                <tr>
                                                  <th>Date</th>
                                                  <th>Status</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {allData.map((data, index) => {
                                                  const date = new Date(
                                                    data.date
                                                  );
                                                  const dateString =
                                                    date.toString() !==
                                                    "Invalid Date"
                                                      ? date
                                                          .toISOString()
                                                          .substring(0, 10)
                                                      : "Invalid Date";
                                                  return (
                                                    <tr key={index}>
                                                      <td>{dateString}</td>
                                                      <td>{data.status}</td>
                                                    </tr>
                                                  );
                                                })}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else {
                                return null;
                              }
                            }
                          )}
                          <div>
                            Overall Attendance Percentage:{" "}
                            {overallAttendancePercentage.toFixed(2)}%
                          </div>

                          <CustomPieChart data={chartData} />
                        </>
                      )}
                    <br />
                    <br />
                    <button
                      onClick={() =>
                        navigate(
                          `/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`
                        )
                      }
                    >
                      Add Attendance
                    </button>
                    <br />
                    <br />
                    <br />
                  </div>
                  <h3>Subject Marks:</h3>

                  {subjectMarks &&
                    Array.isArray(subjectMarks) &&
                    subjectMarks.length > 0 && (
                      <>
                        {subjectMarks.map((result, index) => {
                          if (result.subName.subName === teachSubject) {
                            return (
                              <div key={index}>
                                <div>Subject: {result.subName.subName}</div>
                                <div>Marks: {result.marksObtained}</div>
                              </div>
                            );
                          } else if (!result.subName || !result.marksObtained) {
                            return null;
                          }
                          return null;
                        })}
                      </>
                    )}
                  <br />
                  <PurpleButton
                    onClick={() =>
                      navigate(
                        `/Teacher/class/student/marks/${studentID}/${teachSubjectID}`
                      )
                    }
                  >
                    Add Marks
                  </PurpleButton>
                  <br />
                  <br />
                  <br />
                </div>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default TeacherViewStudent;
