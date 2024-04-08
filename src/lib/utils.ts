import {
  addComponent,
  ComponentTypes,
  getEntity,
  removeComponent,
} from "../engine";
import { setState, State, removeEAP, addEAP } from "../main";
import { Pos } from "./grid";

export const updatePosition = (eId: string, position: Pos) => {
  const entity = getEntity(eId);
  if (!entity) return;

  const { x, y, z } = position;

  removeEAP(entity);

  entity.components.position!.x = x;
  entity.components.position!.y = y;
  entity.components.position!.z = z;

  addEAP(entity);
};

export const addPosition = (eId: string, position: Pos) => {
  const entity = getEntity(eId);
  if (!entity) return;

  addComponent(eId, { position });

  addEAP(entity);
};

export const removePosition = (eId: string) => {
  const entity = getEntity(eId);
  if (!entity) return;
  removeEAP(entity);
  removeComponent(eId, ComponentTypes.Position);
};

export const addLog = (message: string) => {
  setState((state: State) => state.log.push(message));
};
