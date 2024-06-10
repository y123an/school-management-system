import { ChatEngine } from "react-chat-engine";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./chat.css";
import TeacherSideBar from "./TeacherSideBar";
import { jwtDecode } from "jwt-decode";
const projectID = "fb3e7c3a-f951-4453-ade3-88d31e3dd1da";
const user = JSON.parse(localStorage.getItem("user")); // Assuming the token is stored in local storage

let secret = "12345678";

const TeacherChat = () => {
  const name = user["name"];
  console.log(name);
  //console.log(user.name);
  const [username, setUsername] = useState(null);
  useEffect(() => {
    setUsername(user.name);
  }, [user]);

  return (
    <div className="flex h-full">
      <TeacherSideBar />
      <div style={{ height: "100vh", width: "100vw" }}>
        {username && (
          <ChatEngine
            height="100vh"
            projectID={projectID}
            userName={username}
            userSecret={secret}
          />
        )}
      </div>
    </div>
  );
};

// infinite scroll, logout, more customizations...

export default TeacherChat;
