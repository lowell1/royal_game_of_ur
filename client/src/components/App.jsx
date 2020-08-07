import React, {useState, useEffect} from "react";
import {Switch, Route} from "react-router-dom";
import Home from "./Home";
import Game from "./Game";

import socket from "../common/socket.js";
import {updateUsers} from "../common/event_aliases.js";

// socket.on(updateUsers, function(users) {
//   console.log("users", users);
// });

// console.log(socket)

export default function App() {
  const [userList, setUserList] = useState([]);

  useEffect(function() {
    socket.on(updateUsers, function(users) {
      // exclude local socket client from user list
      setUserList(users.filter(user => user.userId !== socket.id));
    });
  }, []);

  return (
    <div>
      {/* <header>
      </header> */}
      <main>
        <Switch>
          <Route render={props => <Home {...props} socket={socket} userList={userList}/>} path="/" exact/>
          <Route component={Game} path="/rooms/:roomId"/>
          {/* <Route component={Home} path="/" exact/>
          <Route component={Game} path="/rooms/:roomId"/> */}
        </Switch>
      </main>
    </div>
  );
}