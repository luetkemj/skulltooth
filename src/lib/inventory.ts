import {
  getEntity,
  removeComponent,
  addComponent,
  ComponentTypes,
} from "../engine";
import { Pos, line } from "./grid";
import {
  blockingEntitiesAtPos,
  addPosition,
  removePosition,
  updatePosition,
} from "./utils";

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
  const containerEntity = getEntity(containerEId);
  if (!containerEntity) return;

  const { position } = containerEntity.components;
  if (!position) return;

  const trajectory = line(position, targetPos);

  let finalPos = position;
  let hasBeenBlocked = false;

  // remove first item in trajectory as it's the container entity
  for (const pos of trajectory.slice(1)) {
    if (hasBeenBlocked) break;

    const blockingEntity = blockingEntitiesAtPos(pos);
    if (!blockingEntity && !hasBeenBlocked) {
      finalPos = pos;
    } else {
      console.log(blockingEntity);
      console.log(`You hit a ${blockingEntity.components.name}`);
      hasBeenBlocked = true;
    }
  }
  console.log(finalPos);
  dropItem(itemEId, containerEId);
  updatePosition(itemEId, finalPos);

  // need to draw a line to target - hit first blocking item in line - stop at that location.
  // if it can pass through some things - deal with that too.
};
