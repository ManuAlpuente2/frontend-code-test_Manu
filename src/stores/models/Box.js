import { types } from "mobx-state-tree";

const BoxModel = types
  .model("Box", {
    id: types.identifier,
    width: 200,
    height: 100,
    color: "#FFF000",
    left: 200,
    top: 100,
    selected: false,
  })
  .views((self) => ({
    get position() {
      return { left: self.left, top: self.top };
    },
  }))
  .actions((self) => ({
    move(dx, dy) {
      self.left += dx;
      self.top += dy;
    },
    setPosition(left, top) {
      self.left = left;
      self.top = top;
    },
    setColor(color) {
      self.color = color;
    },
    toggleSelection() {
      self.selected = !self.selected;
    },
    select() {
      self.selected = true;
    },
    deselect() {
      self.selected = false;
    },
  }));

export default BoxModel;
