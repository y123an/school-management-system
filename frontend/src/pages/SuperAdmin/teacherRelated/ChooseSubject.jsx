import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getTeacherFreeClassSubjects } from "../../../redux/sclassRelated/sclassHandle";
import { updateTeachSubject } from "../../../redux/teacherRelated/teacherHandle";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";

const ChooseSubject = ({ situation }) => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [classID, setClassID] = useState("");
  const [teacherID, setTeacherID] = useState(null);
  const [loader, setLoader] = useState(false);

  const { subjectsList, loading, error, response } = useSelector(
    (state) => state.sclass
  );

  useEffect(() => {
    if (situation === "Norm") {
      setClassID(params.id);
      const classID = params.id;
      dispatch(getTeacherFreeClassSubjects(classID));
    } else if (situation === "Teacher") {
      const { classID, teacherID } = params;
      setClassID(classID);
      setTeacherID(teacherID);
      dispatch(getTeacherFreeClassSubjects(classID));
    }
  }, [situation, params, dispatch]);

  const updateSubjectHandler = (teacherId, teachSubject) => {
    setLoader(true);
    dispatch(updateTeachSubject(teacherId, teachSubject));
    navigate("/SuperAdmin/teachers");
  };

  return (
    <>
      <div className="h-screen font-poppins flex flex-col">
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
        <div className="flex-1 flex">
          <div className="w-64 bg-white border-r border-gray-200">
            <SideBar />
          </div>
          <div className="flex-1 p-4">
            <h2 className="text-2xl font-bold mb-4">Choose a Subject</h2>
            {loading && (
              <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-4xl text-gray-600" />
              </div>
            )}
            {response && (
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-xl font-bold mb-4">
                  Sorry, all subjects have teachers assigned already
                </h1>
                <button
                  onClick={() => navigate("/SuperAdmin/addsubject/" + classID)}
                  className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-700"
                >
                  Add Subjects
                </button>
              </div>
            )}
            {error && <div>Error: {error.message}</div>}
            {!loading && !response && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">#</th>
                      <th className="px-4 py-2">Subject Name</th>
                      <th className="px-4 py-2">Subject Code</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectsList.map((subject, index) => (
                      <tr key={subject._id} className="border-t">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{subject.subName}</td>
                        <td className="px-4 py-2">{subject.subCode}</td>
                        <td className="px-4 py-2">
                          <button
                            className={`bg-green-500 text-white px-6 py-3 rounded hover:bg-green-700 ${
                              loader && "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={loader}
                            onClick={() =>
                              updateSubjectHandler(teacherID, subject._id)
                            }
                          >
                            {loader ? "Loading..." : "Choose Sub"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseSubject;
