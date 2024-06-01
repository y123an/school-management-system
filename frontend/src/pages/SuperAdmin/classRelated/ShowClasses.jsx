import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import DataTable from "react-data-table-component";

import Popup from "../../../components/Popup";
import { FaTrashAlt, FaPlusCircle, FaUserPlus, FaPlus } from "react-icons/fa";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry, the delete function has been disabled for now.");
    // Uncomment the lines below if delete function is enabled
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllSclasses(adminID, "Sclass"));
    });
    setShowPopup(true);
  };

  const columns = [
    {
      name: "Class Name",
      selector: (row) => row.name,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Actions",
      cell: (row) => <SclassButtonHaver row={row} />,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "200px",
    },
  ];

  const data =
    sclassesList &&
    sclassesList.length > 0 &&
    sclassesList.map((sclass) => ({
      name: sclass.sclassName,
      id: sclass._id,
    }));

  const SclassButtonHaver = ({ row }) => {
    const actions = [
      {
        icon: <FaPlus />,
        name: "Add Subjects",
        action: () => navigate("/SuperAdmin/addsubject/" + row.id),
      },
      {
        icon: <FaUserPlus />,
        name: "Add Student",
        action: () => navigate("/SuperAdmin/class/addstudents/" + row.id),
      },
    ];

    return (
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => deleteHandler(row.id, "Sclass")}
          className="text-red-500"
        >
          <FaTrashAlt />
        </button>
        <button
          onClick={() => navigate("/SuperAdmin/classes/class/" + row.id)}
          className="bg-blue-500 text-white py-1 px-2 rounded"
        >
          View
        </button>
        <ActionMenu actions={actions} />
      </div>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
      setOpen(!open);
    };

    return (
      <div className="relative">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 text-blue-500"
        >
          <span>Add</span>
          <FaPlusCircle />
        </button>
        {open && (
          <div className="absolute right-0 -top-20 w-48 bg-white shadow-lg rounded z-50">
            {actions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="mr-2">{action.icon}</div>
                <div>{action.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const actions = [
    {
      icon: <FaPlusCircle className="text-blue-500" />,
      name: "Add New Class",
      action: () => navigate("/SuperAdmin/addclass"),
    },
    {
      icon: <FaTrashAlt className="text-red-500" />,
      name: "Delete All Classes",
      action: () => deleteHandler(adminID, "Sclasses"),
    },
  ];

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
        <span className="text-lg font-semibold">Super Admin Dashboard</span>
        <AccountMenu />
      </div>
      <div className="flex h-full">
        <div
          className={`bg-white ${
            open ? "block" : "hidden"
          } lg:block border-r border-gray-200 w-64`}
        >
          <SideBar />
        </div>
        <div className="flex-grow p-6 relative">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="grid ">
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => navigate("/SuperAdmin/addclass")}
                  className="bg-green-500 text-white py-1 px-4 rounded"
                >
                  Add Class
                </button>
              </div>
              <>
                {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                  <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    highlightOnHover
                    responsive
                    customStyles={{
                      headCells: {
                        style: {
                          fontWeight: "bold",
                          backgroundColor: "#f8f9fa",
                        },
                      },
                      rows: {
                        style: {
                          minHeight: "72px", // override the row height
                        },
                      },
                    }}
                  />
                )}
              </>
            </div>
          )}
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

export default ShowClasses;
