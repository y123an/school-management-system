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
    navigate(`/SuperAdmin/teachers/addsubject/${teacherDetails?._id}`);
  };

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  console.log(teacherDetails);

  return (
    <>
      <div className="h-screen font-poppins">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white shadow-md">
          <button
            onClick={toggleDrawer}
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            {open ? <IoMdArrowBack size={24} /> : <IoIosMenu size={24} />}
          </button>
          <span className="text-lg font-semibold">Super Admin Dashboard</span>
          <AccountMenu />
        </div>
        <div className="flex flex-grow">
          <div
            className={`bg-white border-r border-gray-200 ${
              open ? "block" : "hidden"
            } md:block w-64`}
          >
            <SideBar />
          </div>
          <div className="flex flex-col items-center justify-center flex-grow bg-gray-100">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                loading...
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                  Teacher Details
                </h1>
                <div className="mb-6">
                  <p className="text-xl mb-4">
                    <strong>Teacher Name:</strong> {teacherDetails?.name}
                  </p>
                  <p className="text-xl mb-4">
                    <strong>Email:</strong> {teacherDetails?.email}
                  </p>
                  <p className="text-xl mb-4">
                    <strong>Role:</strong> {teacherDetails?.role}
                  </p>
                  <div className="text-xl mb-4">
                    <strong>Classes:</strong>
                    {teacherDetails?.classes?.map((cls, index) => (
                      <div
                        key={index}
                        className="p-4 mt-4 border rounded-lg shadow-sm flex flex-col gap-2 bg-gray-50"
                      >
                        <span className="text-lg">
                          <strong>Class Name:</strong>{" "}
                          {cls?.teachSclass?.gradelevel}{" "}
                          {cls?.teachSclass?.section}
                        </span>
                        <span className="text-lg">
                          <strong>Subject Name:</strong>{" "}
                          {cls?.teachSubject?.subName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddSubject}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Add Subject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDetails;
