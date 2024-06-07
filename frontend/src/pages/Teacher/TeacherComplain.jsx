import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../redux/userRelated/userHandle";

import { BlueButton } from "../../components/ButtonStyles";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TeacherSideBar from "./TeacherSideBar";
import AccountMenu from "../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import Popup from "../../components/Popup";

const TeacherComplain = () => {
  const [complaint, setComplaint] = useState("");
  const [date, setDate] = useState("");

  const dispatch = useDispatch();

  const { status, currentUser, currentRole, error } = useSelector(
    (state) => state.user
  );

  const user = currentUser._id;
  const address = "Complain";

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const fields = {
    name: currentUser.name,
    role: currentRole,
    userId: user,
    userType: currentRole,
    complaint: complaint,
  };

  console.log(currentUser);

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    } else if (error) {
      setLoader(false);
      setShowPopup(true);
      setMessage("Network Error");
    }
  }, [status, error]);

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
      <div className="flex h-full">
        <div
          className={`bg-white ${
            open ? "block" : "hidden"
          } lg:block border-r border-gray-200 w-64`}
        >
          <TeacherSideBar />
        </div>
        <>
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-lg px-6 py-24 w-full">
              <div>
                <div className="mb-6">
                  <h4 className="text-2xl font-semibold">Complain</h4>
                </div>
                <form onSubmit={submitHandler}>
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        required
                        className="block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Write your complain
                      </label>
                      <textarea
                        value={complaint}
                        onChange={(event) => setComplaint(event.target.value)}
                        required
                        className="block w-full p-2 border border-gray-300 rounded-md"
                        rows="4"
                      ></textarea>
                    </div>
                  </div>
                  <BlueButton
                    className="mt-6 w-full flex items-center justify-center p-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    type="submit"
                    disabled={loader}
                  >
                    {loader ? (
                      <AiOutlineLoading3Quarters
                        className="animate-spin"
                        size={24}
                      />
                    ) : (
                      "Add"
                    )}
                  </BlueButton>
                </form>
              </div>
            </div>
          </div>
          <Popup
            message={message}
            setShowPopup={setShowPopup}
            showPopup={showPopup}
          />
        </>
      </div>
    </div>
  );
};

export default TeacherComplain;
