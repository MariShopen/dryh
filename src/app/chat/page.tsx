"use client"
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface IMsgDataTypes {
  msg: String;
  time: String;
}

const socket = io("http://localhost:3001");

const ChatPage = () => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
    });

    return () => {
      socket.off("receive_msg");
    };
  }, []);

  return (
    <div>
      <div>
        <div style={{ marginBottom: "1rem" }}>
        </div>
        <div>
          {chat.map(({ msg, time }, key) => (
            <div
              key={key}
            >
              <h3>
                {msg}
              </h3>
            </div>
          ))}
        </div>
        <div>
          <form onSubmit={(e) => sendData(e)}>
            <input
              type="text"
              value={currentMsg}
              placeholder="Type your message.."
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            <button>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
