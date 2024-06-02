import React, { useEffect, useState } from "react";
import {
  getClassStudents,
  getSubjectDetails,
} from "../../../redux/sclassRelated/sclassHandle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineTable, AiOutlineBarChart } from "react-icons/ai";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const ViewSubject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } =
    useSelector((state) => state.sclass);

  const { classID, subjectID } = params;

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error);
  }

  const [tabIndex, setTabIndex] = useState(0);

  const tabListClass =
    "flex w-full justify-around bg-gray-100 border-b border-gray-300";
  const tabClass = "py-2 px-4 cursor-pointer";
  const selectedTabClass =
    "py-2 px-4 cursor-pointer bg-white border-l border-t border-r rounded-t shadow-md";

  const studentRows = sclassStudents.map((student) => ({
    rollNum: student.rollNum,
    name: student.name,
    id: student._id,
  }));

  const StudentsAttendanceButtonHaver = ({ row }) => (
    <>
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => navigate("/Admin/students/student/" + row.id)}
      >
        View
      </button>
      <button
        className="text-green-500 hover:text-green-700"
        onClick={() =>
          navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
        }
      >
        Take Attendance
      </button>
    </>
  );

  const StudentsMarksButtonHaver = ({ row }) => (
    <>
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => navigate("/Admin/students/student/" + row.id)}
      >
        View
      </button>
      <button
        className="text-green-500 hover:text-green-700"
        onClick={() =>
          navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)
        }
      >
        Provide Marks
      </button>
    </>
  );

  const SubjectStudentsSection = () => (
    <>
      {getresponse ? (
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
          >
            Add Students
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <h5 className="text-xl font-semibold mb-4">Students List:</h5>
          <div className="overflow-x-auto">
            <table className="w-full bg-white divide-y divide-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentRows.map((student, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.rollNum}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {tabIndex === 1 ? (
                        <StudentsAttendanceButtonHaver row={student} />
                      ) : (
                        <StudentsMarksButtonHaver row={student} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md">
            <Tabs
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
              className="flex justify-center"
            >
              <TabList className={tabListClass}>
                <Tab className={tabIndex === 0 ? selectedTabClass : tabClass}>
                  <AiOutlineTable className="inline-block mr-2" />
                  Attendance
                </Tab>
                <Tab className={tabIndex === 1 ? selectedTabClass : tabClass}>
                  <AiOutlineBarChart className="inline-block mr-2" />
                  Marks
                </Tab>
              </TabList>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );

  const SubjectDetailsSection = () => (
    <div className="text-center p-10 border border-gray-200 rounded-md shadow-md">
      <h4 className="text-2xl mb-4 font-bold">Subject Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <h6 className="text-lg mb-2 font-semibold">Subject Name:</h6>
          <p className="text-lg mb-2">
            {subjectDetails ? subjectDetails.subName : "N/A"}
          </p>
        </div>
        <div className="mb-4">
          <h6 className="text-lg mb-2 font-semibold">Subject Code:</h6>
          <p className="text-lg mb-2">
            {subjectDetails ? subjectDetails.subCode : "N/A"}
          </p>
        </div>
        <div className="mb-4">
          <h6 className="text-lg mb-2 font-semibold">Subject Sessions:</h6>
          <p className="text-lg mb-2">
            {subjectDetails ? subjectDetails.sessions : "N/A"}
          </p>
        </div>
        <div className="mb-4">
          <h6 className="text-lg mb-2 font-semibold">Number of Students:</h6>
          <p className="text-lg mb-2">{sclassStudents.length}</p>
        </div>
        <div className="mb-4">
          <h6 className="text-lg mb-2 font-semibold">Class Name:</h6>
          <p className="text-lg mb-2">
            {subjectDetails &&
            subjectDetails.sclassName &&
            subjectDetails.sclassName.sclassName
              ? subjectDetails.sclassName.sclassName
              : "N/A"}
          </p>
        </div>
        <div className="mb-4">
          {subjectDetails && subjectDetails.teacher ? (
            <>
              <h6 className="text-lg mb-2 font-semibold">Teacher Name:</h6>
              <p className="text-lg mb-2">{subjectDetails.teacher.name}</p>
            </>
          ) : (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600"
              onClick={() =>
                navigate("/Admin/teachers/addteacher/" + subjectDetails._id)
              }
            >
              Add Subject Teacher
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen(!open);

  return (
    <div className="h-screen font-poppins">
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
      <div className="flex h-screen">
        <div className="order-b border-gray-200 w-64">
          <div
            className={`bg-white shadow-md transition-transform ${
              open ? "w-64" : "w-0"
            } overflow-hidden`}
          >
            <SideBar />
          </div>
        </div>
        <>
          {subloading ? (
            <div>Loading...</div>
          ) : (
            <div className="w-full">
              <Tabs
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
              >
                <TabList className="fixed w-full flex bg-white z-10 border-b border-gray-300">
                  <Tab className={tabIndex === 0 ? selectedTabClass : tabClass}>
                    Details
                  </Tab>
                  <Tab className={tabIndex === 1 ? selectedTabClass : tabClass}>
                    Students
                  </Tab>
                </TabList>
                <div className="container mx-auto mt-16 mb-16">
                  <TabPanel>
                    <SubjectDetailsSection />
                  </TabPanel>
                  <TabPanel>
                    <SubjectStudentsSection />
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default ViewSubject;
