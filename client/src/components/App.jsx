import React from "react";
import {Switch, Route} from "react-router-dom";
import Home from "./Home";
import Game from "./Game";

export default function App() {
  return (
    <div>
      <main>
        <Switch>
          <Route component={Home} path="/" exact/>
          <Route component={Game} path="/rooms/:roomId"/>
        </Switch>
      </main>
    </div>
  );
}