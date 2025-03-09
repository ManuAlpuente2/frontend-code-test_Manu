import React from "react";
import ReactDOM from "react-dom";
import "./main.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import store from "./stores/MainStore";

try {
  store.afterCreate();
} catch (e) {
  console.error("Error initializing store:", e);
  try {
    localStorage.removeItem("canvasState");
    store.afterCreate();
  } catch (retryError) {
    console.error("Failed to recover from initialization error:", retryError);
  }
}

store.undoManager.targetStore = store;
store.undoManager.withoutUndo(() => {});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
