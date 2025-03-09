import React from "react";
import { observer } from "mobx-react";
import store from "../stores/MainStore";
import { ReactComponent as UndoIcon } from "../assets/icons/undo.svg";
import { ReactComponent as RedoIcon } from "../assets/icons/redo.svg";

function Toolbar() {
  const handleUndo = () => {
    store.undoManager.undo();
  };

  const handleRedo = () => {
    store.undoManager.redo();
  };

  return (
    <div className="toolbar">
      <button onClick={handleUndo} disabled={!store.undoManager.canUndo}>
        <UndoIcon />
      </button>
      <button onClick={handleRedo} disabled={!store.undoManager.canRedo}>
        <RedoIcon />
      </button>
      <span className="separator"></span>
      {store.selectedCount !== 0 && (
        <span className={`${store.selectedCount !== 0 ? "show" : ""}`}>
          {store.selectedCount} {store.selectedCount === 1 ? "box" : "boxes"}{" "}
          selected
        </span>
      )}
    </div>
  );
}

export default observer(Toolbar);
