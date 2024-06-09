import { ChatEngine } from "react-chat-engine";
import { useState, useEffect } from "react";
import "./chat.css";
import TeacherSideBar from "./TeacherSideBar";
import { jwtDecode } from "jwt-decode";
const projectID = "fb3e7c3a-f951-4453-ade3-88d31e3dd1da";
const token = localStorage.getItem("token"); // Assuming the token is stored in local storage
let username = "";
let secret = "12345678";

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.role === "Teacher") {
    username = decodedToken.chat.username;
  }
}
console.log(username);
const TeacherChat = () => {
  return (
    <div className="flex h-full">
      <TeacherSideBar />
      <div style={{ height: "100vh", width: "100vw" }}>
        <ChatEngine
          height="100vh"
          projectID={projectID}
          userName={username}
          userSecret={secret}
        />
      </div>
    </div>
  );
};

// infinite scroll, logout, more customizations...

export default TeacherChat;
