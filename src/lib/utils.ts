import {
  addComponent,
  ComponentTypes,
  getEntity,
  removeComponent,
  EffectsComponent,
  Entity,
  EId,
} from "../engine";
import { getState, setState, State, removeEAP, addEAP } from "../main";
import { Pos, toPosId } from "./grid";

export const outOfBounds = (pos: Pos) => {
  const { x, y } = pos;
  const { width, height } = getState().views.map!;
  return x < 0 || y < 0 || x >= width || y >= height;
};

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

export const addEffectsToEntity = (
  effects: EffectsComponent,
  entity: Entity
) => {
  // check if entity has activeEffects component
  if (!entity.components.activeEffects) return;

  entity.components.activeEffects.push(...effects);
};

export const applyDamages = (eId: EId, targetEId: EId) => {
  const entity = getEntity(eId);
  const target = getEntity(targetEId);
  if (!entity || !target) return;

  // get damages component from equpped weapon
  const damages = entity.components.damages;
  if (!damages) return;

  damages.forEach((dmg) => (dmg.sourceEId = entity.id));

  // apply damages to target
  // if no active damages component - add one!
  if (!target.components.activeDamages) {
    addComponent(target.id, { activeDamages: [] });
  }

  target.components.activeDamages!.push(...damages);
};

export const equipItem = (eId: EId, targetEId: EId) => {
  const entity = getEntity(eId);
  const target = getEntity(targetEId);
  if (!entity || !target) return;

  // needs to be some logic around - something already being equipped, is item in your inventory etc. But at the moment it's 4:50 am and I'm tired.
  addComponent(targetEId, { equippedWeapon: eId });
};

export const blockingEntitiesAtPos = (pos: Pos): Entity | undefined => {
  const posId = toPosId(pos);
  const eAP = getState().eAP[posId];
  let blockingEntity;
  eAP.forEach((eId) => {
    const entity = getEntity(eId);
    if (!entity) return;
    if (entity.components.isBlocking) {
      blockingEntity = entity;
    }
  });

  if (blockingEntity) return blockingEntity;
  return;
};
