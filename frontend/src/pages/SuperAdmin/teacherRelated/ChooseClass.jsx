import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { useNavigate } from "react-router-dom";
import TableTemplate from "../../../components/TableTemplate";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { FaSpinner } from "react-icons/fa"; // Import FaSpinner icon

const ChooseClass = ({ situation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllSclasses(currentUser._id, "Sclass"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const navigateHandler = (classID) => {
    if (situation === "Teacher") {
      navigate("/SuperAdmin/teachers/choosesubject/" + classID);
    } else if (situation === "Subject") {
      navigate("/SuperAdmin/addsubject/" + classID);
    }
  };

  const sclassColumns = [{ id: "name", label: "Class Name", minWidth: 170 }];

  const sclassRows =
    sclassesList &&
    sclassesList.length > 0 &&
    sclassesList.map((sclass) => {
      return {
        name: sclass.gradelevel + sclass.section,
        id: sclass._id,
      };
    });

  const SclassButtonHaver = ({ row }) => (
    <button
      onClick={() => navigateHandler(row.id)}
      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
    >
      Choose
    </button>
  );

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-screen flex font-poppins">
        <div className="w-64 bg-white border-r border-gray-200">
          <SideBar />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center h-16 px-6 border-b border-gray-200">
            <button
              onClick={toggleDrawer}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              {open ? <IoMdArrowBack /> : <IoIosMenu />}
            </button>
            <span className="text-lg font-semibold">Super Admin Dashboard</span>
            <AccountMenu />
          </div>
          <div className="flex-1 p-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <FaSpinner className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <div>
                <h6 className="text-lg font-medium mb-4">Choose a class</h6>
                {getresponse ? (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => navigate("/Admin/addclass")}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add Class
                    </button>
                  </div>
                ) : (
                  <>
                    {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                      <TableTemplate
                        buttonHaver={SclassButtonHaver}
                        columns={sclassColumns}
                        rows={sclassRows}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseClass;
