import React from "react";

import { observer } from "mobx-react";
import Box from "../components/Box";

function Canvas({ store }) {
  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      store.clearSelection();
    }
  };

  return (
    <div className="canva" onClick={handleCanvasClick}>
      {store.boxes.map((box) => (
        <Box
          id={box.id}
          key={box.id}
          color={box.color}
          left={box.left}
          top={box.top}
          width={box.width}
          height={box.height}
          box={box}
        />
      ))}
    </div>
  );
}

export default observer(Canvas);
