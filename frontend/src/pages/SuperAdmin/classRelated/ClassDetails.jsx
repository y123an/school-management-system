import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteClassFromTeacher,
  getClassDetails,
  getClassStudents,
  getSubjectList,
  getTeachersByClassID,
} from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import TableTemplate from "../../../components/TableTemplate";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import {
  FaUserPlus,
  FaUserMinus,
  FaTrash,
  FaPlus,
  FaEye,
} from "react-icons/fa";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import AccountMenu from "../../../components/AccountMenu";
import SideBar from "../SideBar";

const ClassDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    subjectsList,
    sclassStudents,
    sclassDetails,
    sclassTeachers,
    loading,
    error,
    response,
    getresponse,
  } = useSelector((state) => state.sclass);

  const classID = params.id;

  useEffect(() => {
    dispatch(getClassDetails(classID, "Sclass"));
    dispatch(getSubjectList(classID, "ClassSubjects"));
    dispatch(getClassStudents(classID));
    dispatch(getTeachersByClassID(classID));
  }, [dispatch, classID]);

  if (error) {
    console.log(error);
  }

  console.log(sclassTeachers);
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getClassStudents(classID));
      dispatch(resetSubjects());
      dispatch(getSubjectList(classID, "ClassSubjects"));
    });
  };

  const subjectColumns = [
    { id: "name", label: "Subject Name", minWidth: 170 },
    { id: "code", label: "Subject Code", minWidth: 100 },
  ];

  const subjectRows =
    subjectsList &&
    subjectsList.length > 0 &&
    subjectsList.map((subject) => {
      return {
        name: subject.subName,
        code: subject.subCode,
        id: subject._id,
      };
    });

  const teacherColumuns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "email", minWidth: 100 },
    { id: "role", label: "role", minWidth: 170 },
  ];

  const teacherRows =
    sclassTeachers && sclassTeachers.length > 0
      ? sclassTeachers.map((teacher) => ({
          name: teacher.name,
          email: teacher.email,
          role: teacher.role,
          teachSclassID: teacher.classes.teachSclass,
          id: teacher._id,
        }))
      : [];

  const SubjectsButtonHaver = ({ row }) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => deleteHandler(row.id, "Subject")}
          className="text-red-500"
        >
          <FaTrash />
        </button>
        <button
          onClick={() => {
            navigate(`/SuperAdmin/class/subject/${classID}/${row.id}`);
          }}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          View
        </button>
      </div>
    );
  };

  const subjectActions = [
    {
      icon: <FaPlus className="text-blue-500" />,
      name: "Add New Subject",
      action: () => navigate("/SuperAdmin/addsubject/" + classID),
    },
    {
      icon: <FaTrash className="text-red-500" />,
      name: "Delete All Subjects",
      action: () => deleteHandler(classID, "SubjectsClass"),
    },
  ];

  const ClassSubjectsSection = () => {
    return (
      <div>
        {response ? (
          <div className="flex justify-end mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => navigate("/SuperAdmin/addsubject/" + classID)}
            >
              Add Subjects
            </button>
          </div>
        ) : (
          <div>
            <h5 className="text-lg font-semibold mb-4">Subjects List:</h5>
            <TableTemplate
              buttonHaver={SubjectsButtonHaver}
              columns={subjectColumns}
              rows={subjectRows}
            />
            <SpeedDialTemplate actions={subjectActions} />
          </div>
        )}
      </div>
    );
  };

  const studentColumns = [
    { id: "firstName", label: "First Name", minWidth: 170 },
    { id: "lastName", label: "Last Name", minWidth: 170 },
    { id: "grandfatherName", label: "Grand Father Name", minWidth: 170 },
    { id: "studentID", label: "Student ID", minWidth: 100 },
    { id: "className", label: "Class", minWidth: 170 },
  ];

  const studentRows = sclassStudents.map((student) => {
    return {
      firstName: student.firstName,
      lastName: student.lastName,
      grandfatherName: student.grandfathersName,
      studentID: student.studentID,
      className: student.className,
      id: student._id,
    };
  });

  const TeacherButtonHaver = ({ row }) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => {
            console.log("sds");
            dispatch(deleteClassFromTeacher(row.id, classID));
            dispatch(getTeachersByClassID(classID));
          }}
          className="text-red-500"
        >
          <FaUserMinus />
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => navigate(`/SuperAdmin/teachers/teacher/${row.id}`)}
        >
          View
        </button>
        {/* <button
          className="bg-purple-500 text-white px-2 py-1 rounded"
          onClick={() =>
            navigate("/SuperAdmin/students/student/attendance/" + row.id)
          }
        >
          Attendance
        </button> */}
      </div>
    );
  };
  const StudentsButtonHaver = ({ row }) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => deleteHandler(row.id, "Student")}
          className="text-red-500"
        >
          <FaUserMinus />
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => navigate("/SuperAdmin/students/student/" + row.id)}
        >
          View
        </button>
        {/* <button
          className="bg-purple-500 text-white px-2 py-1 rounded"
          onClick={() =>
            navigate("/SuperAdmin/students/student/attendance/" + row.id)
          }
        >
          Attendance
        </button> */}
      </div>
    );
  };

  const studentActions = [
    {
      icon: <FaUserPlus className="text-blue-500" />,
      name: "Add New Student",
      action: () => navigate("/SuperAdmin/class/addstudents/" + classID),
    },
    {
      icon: <FaUserMinus className="text-red-500" />,
      name: "Delete All Students",
      action: () => deleteHandler(classID, "StudentsClass"),
    },
  ];

  const ClassStudentsSection = () => {
    return (
      <div>
        {getresponse ? (
          <div className="flex justify-end mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() =>
                navigate("/SuperAdmin/class/addstudents/" + classID)
              }
            >
              Add Students
            </button>
          </div>
        ) : (
          <div>
            <h5 className="text-lg font-semibold mb-4">Students List:</h5>
            <TableTemplate
              buttonHaver={StudentsButtonHaver}
              columns={studentColumns}
              rows={studentRows}
            />
            <SpeedDialTemplate actions={studentActions} />
          </div>
        )}
      </div>
    );
  };

  const ClassTeachersSection = () => {
    return (
      <div>
        {getresponse ? (
          <div className="flex justify-end mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => navigate("/SuperAdmin/teachers/addteacher")}
            >
              Add Teacher
            </button>
          </div>
        ) : (
          <div>
            <h5 className="text-lg font-semibold mb-4">Students List:</h5>
            <TableTemplate
              buttonHaver={TeacherButtonHaver}
              columns={teacherColumuns}
              rows={teacherRows}
            />
            <SpeedDialTemplate actions={studentActions} />
          </div>
        )}
      </div>
    );
  };

  const ClassDetailsSection = () => {
    const numberOfSubjects = subjectsList.length;
    const numberOfStudents = sclassStudents.length;

    return (
      <div className="font-poppins grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <h4 className="text-2xl font-bold text-center mb-4">Class Details</h4>
          <h4 className="text-xl mb-2 text-center font-thin">
            This is Class{" "}
            <span className="font-semibold capitalize">
              {sclassDetails &&
                sclassDetails.gradelevel + sclassDetails.section}
            </span>
          </h4>
        </div>
        <div className="">
          <div>
            <h6 className="text-lg mb-2 font-light">
              Number of Subjects:{" "}
              <span className="font-bold">{numberOfSubjects}</span>
            </h6>
          </div>
          <div>
            <h6 className="text-lg mb-4 font-light">
              Number of Students:{" "}
              <span className="font-bold">{numberOfStudents}</span>
            </h6>
          </div>
        </div>

        <div>
          {getresponse && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() =>
                navigate("/SuperAdmin/class/addstudents/" + classID)
              }
            >
              Add Students
            </button>
          )}
        </div>
        <div>
          {response && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => navigate("/SuperAdmin/addsubject/" + classID)}
            >
              Add Subjects
            </button>
          )}
        </div>
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
          <div className="w-full bg-gray-50">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="p-6">
                <div className="border-b border-gray-200">
                  <div className="flex justify-around">
                    <button
                      onClick={(e) => handleChange(e, "1")}
                      className={`p-4 focus:outline-none ${
                        value === "1" ? "border-b-2 border-blue-500" : ""
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={(e) => handleChange(e, "2")}
                      className={`p-4 focus:outline-none ${
                        value === "2" ? "border-b-2 border-blue-500" : ""
                      }`}
                    >
                      Subjects
                    </button>
                    <button
                      onClick={(e) => handleChange(e, "3")}
                      className={`p-4 focus:outline-none ${
                        value === "3" ? "border-b-2 border-blue-500" : ""
                      }`}
                    >
                      Students
                    </button>
                    <button
                      onClick={(e) => handleChange(e, "4")}
                      className={`p-4 focus:outline-none ${
                        value === "4" ? "border-b-2 border-blue-500" : ""
                      }`}
                    >
                      Teachers
                    </button>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  {sclassDetails?.homeroomteacher ? (
                    <div className="flex justify-end flex-col items-end">
                      <p>
                        <span>Home Room Teacher: </span>
                        {sclassDetails?.homeroomteacher.name}
                      </p>
                      <Link
                        to={`/SuperAdmin/classes/homeRoom/${classID}`}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        update
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to={`/SuperAdmin/classes/homeRoom/${classID}`}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Add Home room teacher
                    </Link>
                  )}
                </div>
                <div className="mt-8">
                  {value === "1" && <ClassDetailsSection />}
                  {value === "2" && <ClassSubjectsSection />}
                  {value === "3" && <ClassStudentsSection />}
                  {value === "4" && <ClassTeachersSection />}
                </div>
              </div>
            )}
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

export default ClassDetails;
