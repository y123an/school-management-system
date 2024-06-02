// import React, { useState } from 'react';
// import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
// import { useDispatch, useSelector } from 'react-redux';
// import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
// import { useNavigate } from 'react-router-dom'
// import { authLogout } from '../../redux/userRelated/userSlice';
// import { Button, Collapse } from '@mui/material';

import { useSelector } from "react-redux";
import SideBar from "./SideBar";
import AccountMenu from "../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";
import { useState } from "react";

const SuperAdminProfile = () => {
  // const [showTab, setShowTab] = useState(false);
  // const buttonText = showTab ? 'Cancel' : 'Edit profile';

  // const navigate = useNavigate()
  // const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  // const { currentUser, response, error } = useSelector((state) => state.user);
  // const address = "Admin"

  // if (response) { console.log(response) }
  // else if (error) { console.log(error) }

  // const [name, setName] = useState(currentUser.name);
  // const [email, setEmail] = useState(currentUser.email);
  // const [password, setPassword] = useState("");
  // const [schoolName, setSchoolName] = useState(currentUser.schoolName);

  // const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName }

  // const submitHandler = (event) => {
  //     event.preventDefault()
  //     dispatch(updateUser(fields, currentUser._id, address))
  // }

  // const deleteHandler = () => {
  //     try {
  //         dispatch(deleteUser(currentUser._id, "Students"));
  //         dispatch(deleteUser(currentUser._id, address));
  //         dispatch(authLogout());
  //         navigate('/');
  //     } catch (error) {
  //         console.error(error);
  //     }
  // }

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-screen">
        <div className="flex items-center  justify-between h-16 px-6 border-b border-gray-200">
          <button
            onClick={toggleDrawer}
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            {open ? <IoMdArrowBack /> : <IoIosMenu />}
          </button>
          <span className="text-lg font-semibold">Super Admin Dashboard</span>

          <AccountMenu />
        </div>
        <div className="flex h-screen">
          <div className="bg-white border-b border-gray-200 w-64">
            <SideBar />
          </div>
          <div>
            Name: {currentUser.name}
            <br />
            Email: {currentUser.email}
            <br />
            School: {currentUser.schoolName}
            <br />
            {/* <Button variant="contained" color="error" onClick={deleteHandler}>Delete</Button> */}
            {/* <Button variant="contained" sx={styles.showButton}
                onClick={() => setShowTab(!showTab)}>
                {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}{buttonText}
            </Button>
            <Collapse in={showTab} timeout="auto" unmountOnExit>
                <div className="register">
                    <form className="registerForm" onSubmit={submitHandler}>
                        <span className="registerTitle">Edit Details</span>
                        <label>Name</label>
                        <input className="registerInput" type="text" placeholder="Enter your name..."
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name" required />

                        <label>School</label>
                        <input className="registerInput" type="text" placeholder="Enter your school name..."
                            value={schoolName}
                            onChange={(event) => setSchoolName(event.target.value)}
                            autoComplete="name" required />

                        <label>Email</label>
                        <input className="registerInput" type="email" placeholder="Enter your email..."
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email" required />

                        <label>Password</label>
                        <input className="registerInput" type="password" placeholder="Enter your password..."
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password" />

                        <button className="registerButton" type="submit" >Update</button>
                    </form>
                </div>
            </Collapse> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminProfile;

// const styles = {
//     attendanceButton: {
//         backgroundColor: "#270843",
//         "&:hover": {
//             backgroundColor: "#3f1068",
//         }
//     }
// }
