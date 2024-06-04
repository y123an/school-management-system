import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosMenu,
  IoMdArrowBack,
} from "react-icons/io";
import TeacherSideBar from "./TeacherSideBar";
import AccountMenu from "../../components/AccountMenu";

const TeacherClassDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassStudents, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  const classID = currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;

  useEffect(() => {
    dispatch(getClassStudents(classID));
  }, [dispatch, classID]);

  if (error) {
    console.log(error);
  }

  const StudentsButtonHaver = ({ row }) => {
    const options = ["Take Attendance", "Provide Marks"];
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = () => {
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleMarks();
      }
    };

    const handleAttendance = () => {
      navigate(`/Teacher/class/student/attendance/${row.id}`);
    };
    const handleMarks = () => {
      navigate(`/Teacher/class/student/marks/${row.id}`);
    };

    const handleMenuItemClick = (index) => {
      setSelectedIndex(index);
      setOpen(false);
      handleClick();
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    console.log(sclassStudents);

    return (
      <div className="flex items-center space-x-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          onClick={() => navigate("/Teacher/class/student/" + row._id)}
        >
          View
        </button>
        <div className="relative inline-block text-left">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            onClick={handleToggle}
            ref={anchorRef}
          >
            {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {open && (
            <div className="origin-top-right absolute -top-20 z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                {options.map((option, index) => (
                  <button
                    key={option}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-300"
                    onClick={() => handleMenuItemClick(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
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
        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-xl font-semibold">Loading...</div>
            </div>
          ) : (
            <>
              <h4 className="text-center text-2xl font-bold text-gray-800 mt-4">
                Class Details
              </h4>
              {getresponse ? (
                <div className="flex justify-center mt-4 text-xl font-semibold text-gray-600">
                  No Students Found
                </div>
              ) : (
                <div className="mt-8">
                  <h5 className="text-lg font-semibold text-gray-700 mb-4">
                    Students List:
                  </h5>
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <table className="min-w-max w-full table-auto">
                          <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                              <th className="py-3 px-6 text-left">
                                First Name
                              </th>
                              <th className="py-3 px-6 text-left">Last Name</th>
                              <th className="py-3 px-6 text-left">
                                Grand Father Name
                              </th>
                              <th className="py-3 px-6 text-left">
                                Grand Father Name
                              </th>
                              <th className="py-3 px-6 text-left">StudentID</th>
                              <th className="py-3 px-6 text-left">
                                Class Name
                              </th>
                              <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-600 text-sm font-light">
                            {sclassStudents.map((student) => (
                              <tr
                                key={student._id}
                                className="border-b border-gray-200 hover:bg-gray-100"
                              >
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                  {student.firstName}
                                </td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                  {student.lastName}
                                </td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                  {student.grandfathersName}
                                </td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                  {student.studentID}
                                </td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                  {student.className}
                                </td>
                                <td className="py-3 px-6 text-center">
                                  <StudentsButtonHaver row={student} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherClassDetails;
