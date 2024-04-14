import {
  getEntity,
  removeComponent,
  addComponent,
  ComponentTypes,
} from "../engine";
import { Pos } from "./grid";
import { addPosition, removePosition, updatePosition } from "./utils";

export const addItem = (itemEId: string, containerEId: string) => {
  const containerEntity = getEntity(containerEId);

  if (!containerEntity?.components.inventory) return;

  containerEntity.components.inventory.add(itemEId);

  removePosition(itemEId);
  removeComponent(itemEId, ComponentTypes.Legendable);
  removeComponent(itemEId, ComponentTypes.IsInFov);
  removeComponent(itemEId, ComponentTypes.IsRevealed);
};

export const dropItem = (itemEId: string, containerEId: string) => {
  const containerEntity = getEntity(containerEId);
  const itemEntity = getEntity(itemEId);
  if (!containerEntity || !itemEntity) return;

  if (!containerEntity.components.inventory) return;
  if (!containerEntity.components.position) return;

  // remove item from inventory
  containerEntity.components.inventory.delete(itemEId);
  // add position to item
  // deep clone?
  addPosition(itemEId, { ...containerEntity.components.position });
  addComponent(itemEId, { legendable: {} });
};

export const throwItem = (
  itemEId: string,
  containerEId: string,
  targetPos: Pos
) => {
  dropItem(itemEId, containerEId);
  updatePosition(itemEId, targetPos);
};
