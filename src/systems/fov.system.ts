import {
  ComponentTypes,
  getQuery,
  addComponent,
  getEntity,
  removeComponent,
} from "../engine";
import { world } from "../engine/engine";
import { toPosId } from "../lib/grid";
import { getState, setState, State } from "../main";
import createFOV from "../lib/fov";
import { QueryTypes } from "../queries";

const fovEntities = world.with("inFov");
const opaqueEntities = world.with("isOpaque");

export const fovSystem = () => {
  // const inFovQuery = getQuery(QueryTypes.IsInFov);
  // const opaqueQuery = getQuery(QueryTypes.IsOpaque);
  console.log(world)

  const playerEntity = world.entity(getState().playerEId);

  if (!playerEntity) {
    console.log("no player entity");
    return;
  }

  const origin = playerEntity.position;

  if (!origin) {
    return;
  }

  const FOV = createFOV(
    opaqueEntities,
    74, // map width
    39, // map height
    origin,
    10
  );

  // get stale entities from last time fov system ran
  // mark each entity for render
  // remove IsInFov component (will be readded in next step if needed)
  for (const entity of fovEntities) {
    const pos = entity.position;
    if (!pos) return;

    const posId = toPosId(pos);
    setState((state: State) => state.toRender.add(posId));

    world.removeComponent(entity, 'inFov')
  }
  // inFovQuery.entities.forEach((eId) => {
  //   const entity = getEntity(eId);
  //   if (!entity) return;
  //
  //   const pos = entity.components.position;
  //   if (!pos) return;
  //
  //   const posId = toPosId(pos);
  //   setState((state: State) => state.toRender.add(posId));
  //
  //   removeComponent(eId, ComponentTypes.IsInFov);
  // });

  // for each posId
  // mark it for render
  // check each entity at position and update it's components
  FOV.fov.forEach((posId) => {
    setState((state: State) => state.toRender.add(posId));

    const eAP = getState().eAP[posId];

    if (eAP) {
      eAP.forEach((eId) => {
        const entity = world.entity(eId)
        if (!entity) return;
        addComponent(entity, 'inFov', true);
        addComponent(entity, 'revealed', true);
      });
    }
  });
};
