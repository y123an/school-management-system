import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import AccountMenu from "../../../components/AccountMenu";
import SideBar from "../SideBar";
import Popup from "../../../components/Popup";
import { updateHomeRoom } from "../../../redux/sclassRelated/sclassHandle";
import { underControl } from "../../../redux/sclassRelated/sclassSlice";
const AddHomeRoom = () => {
  const params = useParams();
  const { teachersList, loading, error, response, getresponse } = useSelector(
    (state) => state.teacher
  );
  const { status } = useSelector((state) => state.sclass);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [loader, setLoader] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const classID = params.id;
  useEffect(() => {
    dispatch(getAllTeachers(currentUser._id));
  }, [currentUser._id, dispatch]);

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const changeTeacherHandler = (event) => {
    if (event.target.value === "") {
      setTeacher(null);
    } else {
      const selectedTea = teachersList.find(
        (classItem) => classItem._id === event.target.value
      );
      setTeacher(selectedTea._id);
    }
  };
  const fields = {
    teacherID: teacher,
  };
  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateHomeRoom(fields, classID));
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "success") {
      dispatch(underControl());
      navigate(-1);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
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
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <form className="space-y-6" onSubmit={submitHandler}>
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Add Home Room Teacher
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subject</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={teacher}
                  onChange={changeTeacherHandler}
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachersList.map((classItem) => (
                    <option key={classItem._id} value={classItem._id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="w-full bg-blue-500 text-white py-3 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
                type="submit"
                disabled={loader}
              >
                {loader ? (
                  <div className="flex justify-center">loading...</div>
                ) : (
                  "Register"
                )}
              </button>
            </form>
          </div>
          <Popup
            message={message}
            setShowPopup={setShowPopup}
            showPopup={showPopup}
          />
        </div>
      </div>
    </div>
  );
};

export default AddHomeRoom;
