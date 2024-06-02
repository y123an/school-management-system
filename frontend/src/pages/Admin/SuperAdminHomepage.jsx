import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import SeeNotice from "../../components/SeeNotice";
import { img1 as Students } from "../../assets/Images";
import { img2 as Classes } from "../../assets/Images";
import { img3 as Teachers } from "../../assets/Images";
import { img4 as Fees } from "../../assets/Images";
import CountUp from "react-countup";
import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import AccountMenu from "../../components/AccountMenu";
import SideBar from "./SideBar";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const SuperAdminHomePage = () => {
  const dispatch = useDispatch();
  const { studentsList } = useSelector((state) => state.student);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  const { subjectsList } = useSelector((state) => state.sclass);

  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
    dispatch(getSubjectList(adminID, "AllSubjects"));
  }, [adminID, dispatch]);

  const numberOfStudents = studentsList && studentsList.length;
  const numberOfClasses = sclassesList && sclassesList.length;
  const numberOfTeachers = teachersList && teachersList.length;
  const numberOfSubjects = subjectsList && subjectsList.length;

  const [open, setOpen] = useState(true);
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
        <span className="text-lg font-semibold">Super Admin Dashboard</span>
        <AccountMenu />
      </div>
      <div className="flex h-full">
        <div>
          <div
            className={`bg-white shadow-md transition-transform ${
              open ? "w-64" : "w-0"
            } overflow-hidden`}
          >
            <SideBar />
          </div>
        </div>
        <div className="flex-grow p-6">
          <div className="container mx-auto mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 flex flex-col justify-between items-center bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img src={Students} alt="Students" className="w-16 h-16" />
                <p className="text-xl font-semibold mt-4 text-white">
                  Total Students
                </p>
                <CountUp
                  start={0}
                  end={numberOfStudents}
                  duration={2.5}
                  className="text-white text-4xl mt-2"
                />
              </div>
              <div className="p-6 flex flex-col justify-between items-center bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img src={Classes} alt="Classes" className="w-16 h-16" />
                <p className="text-xl font-semibold mt-4 text-white">
                  Total Classes
                </p>
                <CountUp
                  start={0}
                  end={numberOfClasses}
                  duration={5}
                  className="text-white text-4xl mt-2"
                />
              </div>
              <div className="p-6 flex flex-col justify-between items-center bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img src={Teachers} alt="Teachers" className="w-16 h-16" />
                <p className="text-xl font-semibold mt-4 text-white">
                  Total Teachers
                </p>
                <CountUp
                  start={0}
                  end={numberOfTeachers}
                  duration={2.5}
                  className="text-white text-4xl mt-2"
                />
              </div>
              <div className="p-6 flex flex-col justify-between items-center bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img src={Fees} alt="Fees" className="w-16 h-16" />
                <p className="text-xl font-semibold mt-4 text-white">
                  Total Subjects
                </p>
                <CountUp
                  start={0}
                  end={numberOfSubjects}
                  duration={2.5}
                  className="text-white text-4xl mt-2"
                />
              </div>
            </div>
            <div className="mt-8">{/* <SeeNotice /> */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminHomePage;
