import React, { useEffect, useState } from "react";
import { getTeacherDetails } from "../../../redux/teacherRelated/teacherHandle";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const TeacherDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, teacherDetails, error } = useSelector(
    (state) => state.teacher
  );

  const teacherID = params.id;

  useEffect(() => {
    dispatch(getTeacherDetails(teacherID));
  }, [dispatch, teacherID]);

  if (error) {
    console.log(error);
  }

  const handleAddSubject = () => {
    navigate(
      `/SuperAdmin/teachers/choosesubject/${teacherDetails?.classes[0]?.teachSclass?._id}/${teacherDetails?._id}`
    );
  };

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  console.log(teacherDetails);

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
          <>
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            ) : (
              <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold text-center mb-8">
                  Teacher Details
                </h1>
                <p className="text-xl mb-4">
                  <strong>Teacher Name:</strong> {teacherDetails?.name}
                </p>
                <p className="text-xl mb-4">
                  <strong>Email:</strong> {teacherDetails?.email}
                </p>
                <p className="text-xl mb-4">
                  <strong>Role:</strong> {teacherDetails?.role}
                </p>
                <p className="text-xl mb-4">
                  <strong>Attendance:</strong>{" "}
                  {teacherDetails?.attendance.length}
                </p>
                <p className="text-xl mb-4">
                  <strong>Classes:</strong>{" "}
                  {teacherDetails?.classes.map((cls, index) => (
                    <span key={index}>
                      {cls.teachSubject?.subName} -{" "}
                      {cls.teachSclass?.sclassName}
                      {index !== teacherDetails?.classes.length - 1 && ", "}
                    </span>
                  ))}
                </p>
                <button
                  onClick={handleAddSubject}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Subject
                </button>
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default TeacherDetails;
