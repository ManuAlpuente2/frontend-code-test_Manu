import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react";
import interact from "interactjs";
import store from "../stores/MainStore";

function BoxDraggable(props) {
  const boxRef = useRef(null);
  const { box } = props;
  const isSelected = store.selectedBoxIds.includes(box.id);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.keyCode === 8 || e.key === "Backspace") &&
        store.selectedCount > 0
      ) {
        store.removeSelectedBoxes();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const element = boxRef.current;
    if (!element) return;

    const interactable = interact(element).draggable({
      inertia: false,
      modifiers: [],
      autoScroll: true,
      listeners: {
        start: (event) => {
          const shiftKey = event.originalEvent
            ? event.originalEvent.shiftKey
            : false;

          const currentIsSelected = store.selectedBoxIds.includes(box.id);

          if (!currentIsSelected) {
            store.selectBox(box.id, shiftKey);
          }
          store.startDrag();
        },
        move: (event) => {
          const { dx, dy } = event;
          store.dragMove(box.id, dx, dy);
        },
        end: () => {
          store.endDrag();
        },
      },
    });

    return () => {
      if (interactable) {
        interactable.unset();
      }
    };
  }, [box.id]);

  const handleClick = (e) => {
    e.stopPropagation();
    store.toggleBoxSelection(box.id, e.shiftKey);
  };

  return (
    <div
      ref={boxRef}
      id={props.id}
      className={`box ${isSelected ? "selected" : ""}`}
      style={{
        backgroundColor: props.color,
        width: props.width,
        height: props.height,
        transform: `translate(${props.left}px, ${props.top}px)`,
        boxSizing: "border-box",
      }}
      onClick={handleClick}>
      {props.children}
    </div>
  );
}

export default observer(BoxDraggable);
