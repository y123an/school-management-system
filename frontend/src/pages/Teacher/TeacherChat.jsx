import { ChatEngine } from "react-chat-engine";
import "./chat.css";
import TeacherSideBar from "./TeacherSideBar";
const projectID = "fb3e7c3a-f951-4453-ade3-88d31e3dd1da";
const TeacherChat = () => {
  return (
    <div className="flex h-full">
      <TeacherSideBar />
      <div style={{ height: "100vh", width: "100vw" }}>
        <ChatEngine
          height="100vh"
          projectID={projectID}
          userName="mk"
          userSecret="12345678"
        />
      </div>
    </div>
  );
};

// infinite scroll, logout, more customizations...

export default TeacherChat;
