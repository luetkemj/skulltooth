import {
  ComponentTypes,
  getQuery,
  addComponent,
  getEntity,
  removeComponent,
} from "../engine";
import { toPosId } from '../lib/grid';
import { getState, setState, State } from "../main";
import createFOV from "../lib/fov";
import { QueryTypes } from "../queries";

export const fovSystem = () => {
  const inFovQuery = getQuery(QueryTypes.IsInFov);
  const opaqueQuery = getQuery(QueryTypes.IsOpaque);

  const playerEntity = getEntity(getState().playerEId);

  if (!playerEntity) {
    console.log("no player entity");
    return;
  }

  const origin = playerEntity.components.position;

  if (!origin) {
    return;
  }

  const FOV = createFOV(
    opaqueQuery,
    74, // map width
    39, // map height
    origin,
    10
  );

  // get stale entities from last time fov system ran
  // mark each entity for render
  // remove IsInFov component (will be readded in next step if needed)
  inFovQuery.entities.forEach((eId) => {
    const entity =  getEntity(eId)
    if (!entity) return;

    const pos = entity.components.position;
    if (!pos) return;

    const posId = toPosId(pos)
    setState((state: State) => state.toRender.add(posId))

    removeComponent(eId, ComponentTypes.IsInFov);
  });

  // for each posId
  // mark it for render
  // check each entity at position and update it's components
  FOV.fov.forEach((posId) => {
    setState((state: State) => state.toRender.add(posId))

    const eAP = getState().eAP[posId];

    if (eAP) {
      eAP.forEach((eId) => {
        addComponent(eId, { isInFov: {}, isRevealed: {} });
      });
    }
  });
};
