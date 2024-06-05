import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { bgpic } from "../assets/Images";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const role = state.role;
  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (role === "Student") {
      const rollNum = event.target.rollNumber.value;
      const studentName = event.target.studentName.value;
      const password = event.target.password.value;

      if (!rollNum || !studentName || !password) {
        if (!rollNum) setRollNumberError(true);
        if (!studentName) setStudentNameError(true);
        if (!password) setPasswordError(true);
        return;
      }
      const fields = { rollNum, studentName, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    } else {
      const email = event.target.email.value;
      const password = event.target.password.value;

      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      const fields = { email, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    }
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "rollNumber") setRollNumberError(false);
    if (name === "studentName") setStudentNameError(false);
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") {
        navigate("/Admin/dashboard");
      } else if (currentRole === "SuperAdmin") {
        navigate("/SuperAdmin/dashboard");
      } else if (
        currentRole === "Teacher" ||
        currentRole === "HomeRoomTeacher"
      ) {
        navigate("/Teacher/dashboard");
      }
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  return (
    <div className="min-h-screen font-poppins flex items-center justify-center bg-gray-100">
      <div className="flex items-center w-full  bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full p-8">
          <div className="text-center">
            <h1 className="text-4xl capitalize font-bold text-gray-800 mb-2">
              {role} Login
            </h1>
            <p className="text-gray-600">
              Welcome back! Please enter your details
            </p>
          </div>
          <form noValidate onSubmit={handleSubmit} className="mt-4">
            {role === "Student" ? (
              <>
                <div className="mb-4">
                  <label htmlFor="rollNumber" className="block text-gray-700">
                    Enter your Roll Number
                  </label>
                  <input
                    type="number"
                    id="rollNumber"
                    name="rollNumber"
                    className={`w-full p-2 border rounded ${
                      rollNumberError ? "border-red-500" : "border-gray-300"
                    }`}
                    autoComplete="off"
                    autoFocus
                    onChange={handleInputChange}
                  />
                  {rollNumberError && (
                    <p className="text-red-500 text-sm mt-1">
                      Roll Number is required
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="studentName" className="block text-gray-700">
                    Enter your name
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    className={`w-full p-2 border rounded ${
                      studentNameError ? "border-red-500" : "border-gray-300"
                    }`}
                    autoComplete="name"
                    onChange={handleInputChange}
                  />
                  {studentNameError && (
                    <p className="text-red-500 text-sm mt-1">
                      Name is required
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Enter your email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full p-2 border rounded ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                  autoComplete="email"
                  autoFocus
                  onChange={handleInputChange}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">Email is required</p>
                )}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={toggle ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`w-full p-2 border rounded ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  }`}
                  autoComplete="current-password"
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setToggle(!toggle)}
                    className="focus:outline-none"
                  ></button>
                </div>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">
                  Password is required
                </p>
              )}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-gray-900">
                  Remember me
                </label>
              </div>
              <Link to="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition duration-300"
            >
              {loader ? <div>loading....</div> : "Login"}
            </button>
          </form>
        </div>
        <div
          className="hidden md:block w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bgpic})`, height: "100vh" }}
        ></div>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default LoginPage;
