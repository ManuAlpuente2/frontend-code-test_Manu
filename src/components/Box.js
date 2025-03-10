import React from "react";
import { observer } from "mobx-react";
import BoxDraggable from "./BoxDraggable";

function Box(props) {
  return <BoxDraggable {...props}></BoxDraggable>;
}

export default observer(Box);
