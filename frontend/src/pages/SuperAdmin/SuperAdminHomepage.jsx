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
import AccountMenu from "../../components/AccountMenu";
import SideBar from "./SideBar";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const SuperAdminHomePage = () => {
  const dispatch = useDispatch();
  const { studentsList } = useSelector((state) => state.student);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);

  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  const numberOfStudents = studentsList && studentsList.length;
  const numberOfClasses = sclassesList && sclassesList.length;
  const numberOfTeachers = teachersList && teachersList.length;

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-screen">
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
          <div className="flex-grow bg-gray-100">
            <div className="py-6 px-4">
              <div className="container mx-auto mt-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 flex flex-col justify-between items-center bg-white rounded-lg shadow-md">
                    <img src={Students} alt="Students" />
                    <p className="text-xl font-semibold">Total Students</p>
                    <CountUp
                      start={0}
                      end={numberOfStudents}
                      duration={2.5}
                      className="text-green-600 text-4xl"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between items-center bg-white rounded-lg shadow-md">
                    <img src={Classes} alt="Classes" />
                    <p className="text-xl font-semibold">Total Classes</p>
                    <CountUp
                      start={0}
                      end={numberOfClasses}
                      duration={5}
                      className="text-green-600 text-4xl"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between items-center bg-white rounded-lg shadow-md">
                    <img src={Teachers} alt="Teachers" />
                    <p className="text-xl font-semibold">Total Teachers</p>
                    <CountUp
                      start={0}
                      end={numberOfTeachers}
                      duration={2.5}
                      className="text-green-600 text-4xl"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between items-center bg-white rounded-lg shadow-md">
                    <img src={Fees} alt="Fees" />
                    <p className="text-xl font-semibold">Total Subject</p>
                    <CountUp
                      start={0}
                      end={23000}
                      duration={2.5}
                      prefix="$"
                      className="text-green-600 text-4xl"
                    />
                  </div>
                </div>
                <div className="mt-4">{/* <SeeNotice /> */}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminHomePage;
