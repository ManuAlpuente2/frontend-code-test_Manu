import React from "react";

import store from "../stores/MainStore";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import Actions from "./Actions";
import { observer } from "mobx-react";

function App() {
  console.log(
    "%c¡Gracias por revisar este proyecto! 😊",
    `background: linear-gradient(60deg, #01D0E2 0%, #F6D302 100%);
  color: white;
  display: block;
  line-height: 25px;
  height: 25px;
  padding: 5px;`
  );

  return (
    <div className="app">
      <Toolbar />
      <Canvas store={store} />
      <Actions />
    </div>
  );
}

export default observer(App);
