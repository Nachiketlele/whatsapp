import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar.jsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Components/Login/Login.jsx";
import { useStateValue } from "./Provider/StateProvider";
import db from "./firebase";
import { auth } from "./firebase";
import { actionTypes } from "./Provider/reducer";
import Chat from "./Components/Chats/Chat";
import Loaders from "./Components/Loading/Loader.jsx";

function App() {
  const [ user , dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const listener = auth.onAuthStateChanged((User) => {
      setLoading(false);
      if (User) {
        dispatch({
          type: actionTypes.SET_USER,
          user: User,
        });
      } else {
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        });
      }
    });
    return () => listener();
  }, [dispatch]);


  const removeRoom = (roomid) => {
    db.collection("Rooms")
      .doc(roomid)
      .delete()
      .then(() => {
        alert("Room Deleted");
      });
  };



  if (loading) {
    return <Loaders />;
  }

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <div className="Box">
          <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route path="/" exact>
                <Sidebar hide={false} />
                <Chat hide={true} removeRoom={removeRoom} />
                <div className="Projects">
                  <img
                    src="https://www.logo.wine/a/logo/WhatsApp/WhatsApp-Logo.wine.svg"
                    alt=""
                  />
                </div>
              </Route>
              <Route path="/rooms/:roomId">
                <Sidebar hide={true} />
                <Chat hide={false} removeRoom={removeRoom} />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
