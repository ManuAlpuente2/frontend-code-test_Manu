import { types, getSnapshot, applySnapshot, onSnapshot } from "mobx-state-tree";
import { UndoManager } from "mst-middlewares";
import uuid from "uuid/v4";
import BoxModel from "./models/Box";
import getRandomColor from "../utils/getRandomColor";

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel),
    selectedBoxIds: types.array(types.string),
    undoManager: types.optional(UndoManager, {}),
  })
  .views((self) => ({
    get selectedBoxes() {
      return self.boxes.filter((box) => self.selectedBoxIds.includes(box.id));
    },
    get selectedCount() {
      return self.selectedBoxIds.length;
    },
    getBoxById(id) {
      return self.boxes.find((box) => box.id === id);
    },
  }))
  .actions((self) => {
    let initialState = {};
    let dragInitialPositions = {};

    const afterCreate = () => {
      initialState = getSnapshot(self);

      const savedState = localStorage.getItem("canvasState");
      if (savedState) {
        try {
          applySnapshot(self, JSON.parse(savedState));
        } catch (e) {
          console.error("Failed to load saved state", e);
        }
      }

      onSnapshot(self, (snapshot) => {
        try {
          const snapshotToSave = { ...snapshot };
          if (snapshotToSave.boxes.length > 20) {
            // Solo guardo las cajas más recientes
            snapshotToSave.boxes = snapshotToSave.boxes.slice(-20);
          }
          localStorage.setItem("canvasState", JSON.stringify(snapshotToSave));
        } catch (e) {
          // Si cuota excedida limpio
          console.error("Failed to save state", e);
          try {
            localStorage.removeItem("canvasState");
          } catch (clearError) {
            console.error("Failed to clear localStorage", clearError);
          }
        }
      });
    };

    const createBox = () => {
      const box = BoxModel.create({
        id: uuid(),
        color: getRandomColor(),
        left: Math.random() * 800,
        top: Math.random() * 400,
      });
      self.addBox(box);
      return box;
    };

    const addBox = (box) => {
      self.boxes.push(box);
    };

    const removeBox = (id) => {
      const idx = self.boxes.findIndex((box) => box.id === id);
      if (idx !== -1) {
        self.boxes.splice(idx, 1);
      }

      const selIdx = self.selectedBoxIds.indexOf(id);
      if (selIdx !== -1) {
        self.selectedBoxIds.splice(selIdx, 1);
      }
    };

    const removeSelectedBoxes = () => {
      const idsToRemove = [...self.selectedBoxIds];
      idsToRemove.forEach((id) => {
        removeBox(id);
      });
    };

    const selectBox = (id, multiSelect = false) => {
      const box = self.getBoxById(id);
      if (!box) return;

      if (!multiSelect) {
        clearSelection();
      }

      if (!self.selectedBoxIds.includes(id)) {
        self.selectedBoxIds.push(id);
      }
    };

    const deselectBox = (id) => {
      const idx = self.selectedBoxIds.indexOf(id);
      if (idx !== -1) {
        self.selectedBoxIds.splice(idx, 1);
      }
    };

    const toggleBoxSelection = (id, multiSelect = false) => {
      if (self.selectedBoxIds.includes(id)) {
        deselectBox(id);
      } else {
        selectBox(id, multiSelect);
      }
    };

    const clearSelection = () => {
      self.selectedBoxIds.splice(0, self.selectedBoxIds.length);
    };

    const setColorToSelected = (color) => {
      self.selectedBoxes.forEach((box) => {
        box.setColor(color);
      });
    };

    const reset = () => {
      applySnapshot(self, initialState);
    };

    const startDrag = () => {
      dragInitialPositions = {};
      self.selectedBoxes.forEach((box) => {
        dragInitialPositions[box.id] = { left: box.left, top: box.top };
      });
    };

    const dragMove = (id, dx, dy) => {
      const box = self.getBoxById(id);
      if (!box) return;

      if (self.selectedBoxIds.includes(id)) {
        self.selectedBoxes.forEach((selectedBox) => {
          selectedBox.move(dx, dy);
        });
      } else {
        box.move(dx, dy);
      }
    };

    const endDrag = () => {
      if (Object.keys(dragInitialPositions).length > 0) {
        const finalPositions = {};
        Object.keys(dragInitialPositions).forEach((id) => {
          const box = self.getBoxById(id);
          if (box) {
            finalPositions[id] = { left: box.left, top: box.top };
          }
        });

        let hasChanges = false;
        Object.keys(dragInitialPositions).forEach((id) => {
          const initial = dragInitialPositions[id];
          const final = finalPositions[id];
          if (
            final &&
            (initial.left !== final.left || initial.top !== final.top)
          ) {
            hasChanges = true;
          }
        });

        if (hasChanges) {
          self.undoManager.withoutUndo(() => {
            Object.keys(dragInitialPositions).forEach((id) => {
              const box = self.getBoxById(id);
              if (box) {
                const { left, top } = dragInitialPositions[id];
                box.setPosition(left, top);
              }
            });
          });

          Object.keys(finalPositions).forEach((id) => {
            const box = self.getBoxById(id);
            if (box) {
              const { left, top } = finalPositions[id];
              box.setPosition(left, top);
            }
          });
        }

        dragInitialPositions = {};
      }
    };

    return {
      afterCreate,
      createBox,
      addBox,
      removeBox,
      removeSelectedBoxes,
      selectBox,
      deselectBox,
      toggleBoxSelection,
      clearSelection,
      setColorToSelected,
      reset,
      startDrag,
      dragMove,
      endDrag,
    };
  });

const store = MainStore.create({
  boxes: [],
  selectedBoxIds: [],
});

export default store;
