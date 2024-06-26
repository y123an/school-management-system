import SeeNotice from "../../components/SeeNotice";
import { img1 as Students } from "../../assets/Images";
import { subjects as Lessons } from "../../assets/Images";
import { assignment as Tests } from "../../assets/Images";
import { time as Time } from "../../assets/Images";
import {
  getClassStudents,
  getSubjectDetails,
} from "../../redux/sclassRelated/sclassHandle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TeacherSideBar from "./TeacherSideBar";
import AccountMenu from "../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const TeacherHomePage = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { subjectDetails, sclassStudents } = useSelector(
    (state) => state.sclass
  );

  const classIDs = currentUser.classes.map((cls) => cls.teachSclass?._id);
  const subjectIDs = currentUser.classes.map((cls) => cls.teachSubject?._id);

  const fetchData = () => {
    classIDs.forEach((id) => {
      if (id) {
        dispatch(getClassStudents(id));
      }
    });
    subjectIDs.forEach((id) => {
      if (id) {
        dispatch(getSubjectDetails(id, "Subject"));
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log(currentUser.classes.length);

  const numberOfClass = currentUser.classes.length;
  const numberOfSessions = 0;

  // subjectDetails
  //   ? subjectDetails.reduce(
  //       (sum, subject) => sum + parseInt(subject.sessions, 10),
  //       0
  //     )
  //   : 0;

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
      <div className="flex">
        <div
          className={`bg-white ${
            open ? "block" : "hidden"
          } lg:block border-r border-gray-200 w-64`}
        >
          <TeacherSideBar />
        </div>
        <div className="container mx-auto mt-4 mb-4 p-8">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-md flex flex-col justify-between items-center">
              <img src={Students} alt="Students" className="w-16 h-16" />
              <p className="text-lg font-semibold">Classes</p>
              <p className="text-4xl font-bold">
                <span>{numberOfClass}</span>
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-lg shadow-md flex flex-col justify-between items-center">
              <img src={Lessons} alt="Lessons" className="w-16 h-16" />
              <p className="text-lg font-semibold">Total Lessons</p>
              <p className="text-4xl font-bold">
                <span>{numberOfSessions}</span>
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-6 rounded-lg shadow-md flex flex-col justify-between items-center">
              <img src={Time} alt="Time" className="w-16 h-16" />
              <p className="text-lg font-semibold">Total Hours</p>
              <p className="text-4xl font-bold">
                <span>30</span> hrs
              </p>
            </div>
          </div> */}
          <div className="mt-4">
            <SeeNotice />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomePage;
