import { useContext, useEffect, useRef, useState } from "react";
// import { UserContext } from "./UserContext.jsx";
import { uniqBy } from "lodash";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Contact from "./Contact.jsx";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  const { currentUser } = useSelector((state) => state.user);
  const divUnderMessages = useRef();

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:8000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected. Trying to reconnect.");
        connectToWs();
      }, 1000);
    });
  }
  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ _id, name }) => {
      people[_id] = name;
    });
    console.log(people);
    setOnlinePeople(people);
  }
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);

    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      console.log(messageData.sender + " " + selectedUserId);

      if (messageData.sender === selectedUserId) {
        console.log("ende mineshe");
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  }

  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    const localUser = localStorage.getItem("user");
    const userInfo = JSON.parse(localUser);

    ws.send(
      JSON.stringify({
        sender: userInfo._id,
        recipient: selectedUserId,
        text: newMessageText,
        file,
      })
    );

    setNewMessageText("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: currentUser._id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    connectToWs();
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/people`).then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== currentUser._id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};

      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/messages/${selectedUserId}`, {
          withCredentials: true,
        })
        .then((res) => {
          setMessages(res.data);
        });
    }
  }, [selectedUserId]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[currentUser._id];
  console.log(onlinePeople);
  const messagesWithoutDupes = uniqBy(messages, "_id");

  return (
    <div className="flex h-[90vh]  w-full">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <div className="p-3">Chat Room</div>
          {Object.keys(onlinePeopleExclOurUser).map((_id) => (
            <Contact
              key={_id}
              _id={_id}
              online={true}
              name={onlinePeopleExclOurUser[_id]}
              onClick={() => {
                setSelectedUserId(_id);
              }}
              selected={_id === selectedUserId}
            />
          ))}
          {Object.keys(offlinePeople).map((_id) => (
            <Contact
              key={_id}
              _id={_id}
              online={false}
              name={offlinePeople[_id].name}
              onClick={() => setSelectedUserId(_id)}
              selected={_id === selectedUserId}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-300">
                &larr; Select a person from the sidebar
              </div>
            </div>
          )}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDupes.map((message) => (
                  <div
                    key={message._id}
                    className={
                      message.sender === currentUser._id
                        ? "text-right"
                        : "text-left"
                    }
                  >
                    <div
                      className={`text-left inline-block p-2 my-2 rounded-md text-sm ${
                        message.sender === currentUser._id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-500"
                      }`}
                    >
                      {message.text}
                      {message.file && (
                        <div className="">
                          <a
                            target="_blank"
                            className="flex items-center gap-1 border-b"
                            href={`${axios.defaults.baseURL}/uploads/${message.file}`}
                            rel="noreferrer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages} />
              </div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              placeholder="Type your message here"
              className="bg-white flex-grow border rounded-sm p-2"
            />
            <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
              <input type="file" className="hidden" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <button
              type="submit"
              className="bg-gray-800 p-2 text-white rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
