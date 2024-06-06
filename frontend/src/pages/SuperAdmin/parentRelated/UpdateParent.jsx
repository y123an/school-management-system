import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getSubjectDetails,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";
import {
  registerUser,
  updateUser,
} from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";

const UpdateParent = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subjectID = params.id;
  const { state } = useLocation();
  const { status, response, error, currentUser } = useSelector(
    (state) => state.user
  );
  const { subjectDetails, sclassesList, subjectsList } = useSelector(
    (state) => state.sclass
  );
  const { studentsList } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, "AllSubjects"));
  }, [currentUser._id, dispatch]);

  useEffect(() => {
    dispatch(getAllStudents(currentUser._id, "Allstudents"));
  }, [currentUser._id, dispatch]);

  console.log(state);

  const [name, setName] = useState(state?.parent.name);
  const [email, setEmail] = useState(state?.parent.email);
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(state?.parent.gender);
  const [phone, setPhone] = useState(state?.parent.phone);
  const [search, setSearch] = useState("");
  const [selectedStudentName, setSelectedStudentName] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [student, setStudent] = useState("");

  const role = "Parent";

  const fields = {
    name,
    email,
    password,
    role,
    phone,
    gender,
    children: [{ child: student }],
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!student) {
      setMessage("No student selected. Please select a student.");
      setShowPopup(true);
      setLoader(false);
      return;
    }
    setLoader(true);
    dispatch(updateUser(fields, params.id, "Teacher/update"));
  };
  console.log(status);
  useEffect(() => {
    if (status === "success") {
      dispatch(underControl());
      navigate("/SuperAdmin/parents");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Error, check your inputs for same email or invalid inputs");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const changeStudentHandler = (event) => {
    setSearch(event.target.value);
    setSelectedStudentName(""); // Clear selected student name when typing
  };

  const selectStudent = (studentId, studentName) => {
    setStudent(studentId);
    setSelectedStudentName(studentName);
    setSearch("");
  };

  const filteredStudents = studentsList.filter((student) =>
    `${student.firstName} ${student.lastName} ${student.grandfathersName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <form className="space-y-6" onSubmit={submitHandler}>
                <h2 className="text-2xl font-bold text-center text-gray-800">
                  Update Parent
                </h2>
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Enter parent's name..."
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    placeholder="Enter parent's phone..."
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Enter parent's email..."
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Gender</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Children</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Search for child..."
                    value={search || selectedStudentName}
                    onChange={changeStudentHandler}
                  />
                  {search && (
                    <ul className="mt-2 bg-white border border-gray-300 rounded-lg max-h-40 overflow-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <li
                            key={student._id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              selectStudent(
                                student._id,
                                `${student.firstName} ${student.lastName} ${student.grandfathersName}`
                              )
                            }
                          >
                            {student.firstName} {student.lastName}{" "}
                            {student.grandfathersName}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-red-500">
                          No students found
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Password</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Enter parent's password..."
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <button
                  className="w-full bg-blue-500 text-white py-3 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
                  type="submit"
                  disabled={loader}
                >
                  {loader ? (
                    <div className="flex justify-center">loading</div>
                  ) : (
                    "Update"
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
    </>
  );
};

export default UpdateParent;
