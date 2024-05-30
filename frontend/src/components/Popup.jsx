import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { underControl } from "../redux/userRelated/userSlice";
import { underStudentControl } from "../redux/studentRelated/studentSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup = ({ message, setShowPopup, showPopup }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (showPopup) {
      if (message === "Done Successfully") {
        toast.success(message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: handleClose,
        });
      } else {
        toast.error(message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: handleClose,
        });
      }
    }
  }, [showPopup, message]);

  const handleClose = () => {
    setShowPopup(false);
    dispatch(underControl());
    dispatch(underStudentControl());
  };

  return <ToastContainer />;
};

export default Popup;
