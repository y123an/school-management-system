import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import Popup from "../../../components/Popup";
import { ClassRoom } from "../../../assets/Images";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const AddClass = () => {
  const [gradelevel, setGradelevel] = useState("");
  const [section, setSection] = useState("");
  const [homeroomteacher, setHomeroomteacher] = useState("");
  const [school, setSchool] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error, tempDetails } = userState;

  const adminID = currentUser._id;
  const address = "Sclass";

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const fields = {
    gradelevel: gradelevel,
    section: section,
    // homeroomteacher,
    adminID,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added" && tempDetails) {
      navigate("/Admin/classes/class/" + tempDetails._id);
      dispatch(underControl());
      setLoader(false);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch, tempDetails]);

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-screen font-poppins ">
        <div className="flex items-center justify-between h-16 px-6 bg-white shadow-md">
          <button
            onClick={toggleDrawer}
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            {open ? <IoMdArrowBack /> : <IoIosMenu />}
          </button>
          <span className="text-lg font-semibold">Admin Dashboard</span>
          <AccountMenu />
        </div>
        <div className="flex flex-grow">
          <div>
            <div
              className={`bg-white shadow-md transition-transform ${
                open ? "w-64" : "w-0"
              } overflow-hidden`}
            >
              <SideBar />
            </div>
          </div>
          <div className="flex justify-center items-center w-full bg-gray-100">
            <div className="max-w-md w-full p-8 rounded-lg shadow-md bg-white">
              <div className="flex justify-center mb-6">
                <img src={ClassRoom} alt="classroom" className="w-3/4" />
              </div>
              <form onSubmit={submitHandler}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="gradelevel"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Grade Level
                    </label>
                    <input
                      id="gradelevel"
                      type="number"
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                      value={gradelevel}
                      onChange={(event) => setGradelevel(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="section"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Section
                    </label>
                    <input
                      id="section"
                      type="text"
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                      value={section}
                      onChange={(event) => setSection(event.target.value)}
                      required
                    />
                  </div>
                  {/* <div>
                    <label
                      htmlFor="homeroomteacher"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Homeroom Teacher
                    </label>
                    <input
                      id="homeroomteacher"
                      type="text"
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                      value={homeroomteacher}
                      onChange={(event) =>
                        setHomeroomteacher(event.target.value)
                      }
                      required
                    />
                  </div> */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                    disabled={loader}
                  >
                    {loader ? <div className="loader"></div> : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md shadow hover:bg-gray-50"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AddClass;
