import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { calculateOverallAttendancePercentage } from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import { PurpleButton } from "../../components/ButtonStyles";
import TeacherSideBar from "./TeacherSideBar";
import AccountMenu from "../../components/AccountMenu";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
// import { json2csv } from "json2csv";

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

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [Object.keys(data[0])],
      body: data.map((row) => Object.values(row)),
    });
    return doc;
  };

  // const generateCSV = (data) => {
  //   const fields = Object.keys(data[0]);
  //   const csv = json2csv({ data, fields });
  //   return csv;
  // };

  const handlePDFDownload = () => {
    const pdfData = subjectMarks.map((subject) => ({
      Subject: subject.subName.subName,
      "Total Result": subject.results.reduce(
        (total, res) => total + res.marks,
        0
      ),
      ...subject.results.reduce((acc, res, idx) => {
        acc[`Result ${idx + 1}`] = res.marks;
        return acc;
      }, {}),
    }));
    const pdfDoc = generatePDF(pdfData);
    pdfDoc.save("subject_marks.pdf");
  };

  const csvData = subjectMarks.map((subject) => ({
    Subject: subject.subName.subName,
    "Total Result": subject.results.reduce(
      (total, res) => total + res.marks,
      0
    ),
    ...subject.results.reduce((acc, res, idx) => {
      acc[`Result ${idx + 1}`] = res.marks;
      return acc;
    }, {}),
  }));

  // const handleCSVDownload = () => {
  //   const csv = generateCSV(csvData);
  //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", url);
  //   link.setAttribute("download", "subject_marks.csv");
  //   link.click();
  // };

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

                {subjectMarks &&
                Array.isArray(subjectMarks) &&
                subjectMarks.length > 0 ? (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-blue-600">
                      Subject Marks
                    </h3>
                    <div className="flex gap-3 font-semibold mt-6 text-blue-600">
                      <button
                        onClick={handlePDFDownload}
                        className="bg-blue-500 text-sm text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                      >
                        Download Pdf
                      </button>
                      <CSVLink
                        data={csvData}
                        filename="mark_list.csv"
                        className="bg-blue-500 text-sm text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                      >
                        Download CSV
                      </CSVLink>
                    </div>
                    <table className="w-full mt-4">
                      <thead>
                        <tr className="bg-blue-100 text-blue-800 font-semibold">
                          <th className="py-2 px-4 border">Subject</th>
                          <th className="py-2 px-4 border">Total Result</th>
                          {subjectMarks[0].results.map((res, idx) => (
                            <th key={idx} className="py-2 px-4 border">
                              {res.title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {subjectMarks.map((subject, index) => (
                          <tr key={index} className="bg-white text-gray-700">
                            <td className="py-2 px-4 border">
                              {subject.subName.subName}
                            </td>
                            <td className="py-2 px-4 border">
                              {subject.results.reduce(
                                (total, res) => total + res.marks,
                                0
                              )}
                            </td>
                            {subject.results.map((res, idx) => (
                              <td key={idx} className="py-2 px-4 border">
                                {res.marks}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
