import React from "react";
import { observer } from "mobx-react";
import store from "../stores/MainStore";
import { ReactComponent as AddIcon } from "../assets/icons/add.svg";
import { ReactComponent as RemoveIcon } from "../assets/icons/remove.svg";
import { ReactComponent as ColorIcon } from "../assets/icons/color.svg";
function Actions() {
  const currentColor = (() => {
    if (store.selectedCount === 1) return store.selectedBoxes[0].color;
    return "#000000";
  })();

  const handleAddBox = () => {
    store.createBox();
  };

  const handleRemoveBox = () => {
    store.removeSelectedBoxes();
  };

  const handleColorChange = (e) => {
    store.setColorToSelected(e.target.value);
  };

  return (
    <div className="actions">
      <div className="btn">
        <button onClick={handleAddBox}>
          <AddIcon /> Add
        </button>
        <span className="separator"></span>
        <button onClick={handleRemoveBox} disabled={store.selectedCount === 0}>
          <RemoveIcon />
        </button>
      </div>
      <div className="btn">
        <ColorIcon />
        <input
          type="color"
          onChange={handleColorChange}
          disabled={store.selectedCount === 0}
          value={currentColor}
        />
      </div>
    </div>
  );
}

export default observer(Actions);
