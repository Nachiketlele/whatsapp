import React, { useEffect, useState } from "react";
import { Avatar, ClickAwayListener, IconButton } from "@material-ui/core";
import "./Chat.css";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
  ArrowBack,
} from "@material-ui/icons";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import db from "../../firebase";
import { useStateValue } from "../../Provider/StateProvider";
import firebase from "firebase";


function Chat({ hide, removeRoom }) {
  const [{ user }, dispatch] = useStateValue();
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [showdropdown, setDropdown] = useState(false);

  useEffect(() => {
    setDropdown(false);
    if (roomId) {
      db.collection("Rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          if (snapshot.data()) {
            setRoomName(snapshot.data().name);
          }
        });

      db.collection("Rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((resultsnap) => {
          setMessages(
            resultsnap.docs.map((doc) => {
              return doc.data();
            })
          );
        });
    }
  }, [roomId]);


const sendMessage = (e) => {
    e.preventDefault();
    if (input){
      db.collection("Rooms").doc(roomId).collection("messages").add({
        message: input,
        name: user.displayName,
        email: user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setInput("");
    } else {
      alert("Input is Empty");
    }
  };
  return (
    <div className={hide ? "chat Chat" : "chat"}>
      <div className="chatHeader">
        <Link to="/">
          <IconButton>
            <ArrowBack />
          </IconButton>
        </Link>
        <Avatar src={`https://th.bing.com/th?q=Avatar+Emoji&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.25&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247`} />
        <div className="chatHeaderInfo">
          <h3>{roomName}</h3>
        </div>
        <div className="chatHeaderRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <ClickAwayListener onClickAway={() => setDropdown(false)}>
            <div className="dropdown">
              <IconButton
                onClick={() => {
                  setDropdown(!showdropdown);
                }}
              >
                <MoreVert />
              </IconButton>
              <div
                className={
                  showdropdown ? "dropdown__list" : "dropdown__list hide"
                }
              >
                <ul>
                  <Link to="/">
                    <li
                      onClick={() => {
                        removeRoom(roomId);
                      }}
                    >
                      Delete Room
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </ClickAwayListener>
        </div>
      </div>
      <div className="chatBody">
        {messages.map((message) => (
          <div key={message.timestamp}>
            <p
              className={`chatMessage ${
                message.email === user.email && "chatReceiver"
              }`}
            >
              <span className="chatName">{message.name}</span>
              {message.message}
            </p>
          </div>
        ))}
      </div>
      <div className="chatFooter">
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <IconButton>
          <AttachFile />
        </IconButton>
        <form>
          <input
            required={true}
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Type a message"
          />
          <button type="submit" onClick={sendMessage}>
            Send
          </button>
        </form>
        <IconButton>
          <Mic />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
