import { getQuery, addComponent, getEntity, removeComponent } from "../engine";
import { ComponentTypes } from "../engine/index.types";
import { getState } from "../main";
import createFOV from "../lib/fov";
import { QueryTypes } from "../queries";

export const fovSystem = () => {
  const inFovQuery = getQuery(QueryTypes.IsInFov);
  const opaqueQuery = getQuery(QueryTypes.IsOpaque);
  const isPlayer = getQuery(QueryTypes.IsPlayer);

  // there's gotta be a better way - get the id from setup in main.ts
  const playerEId = [...isPlayer.entities][0]

  if (!playerEId) {
    console.log('no player id')
    return
  }

  const playerEntity = getEntity(playerEId)

  if (!playerEntity) {
    console.log('no player entity')
    return
  }

  const origin = playerEntity.components.position

  if (!origin) {
    return
  }

  const FOV = createFOV(
    opaqueQuery,
    74, // map width
    39, // map height
    origin,
    10
  );

  // clear out stale fov
  // inFovEntities.get().forEach((x) => x.remove(IsInFov));
  inFovQuery.entities.forEach((eId) => {
    removeComponent(eId, ComponentTypes.IsInFov);
  });

  FOV.fov.forEach((posId) => {
    // const entitiesAtLoc = readCacheSet("entitiesAtLocation", posId);
    const eAP = getState().eAP[posId];

    if (eAP) {
      eAP.forEach((eId) => {
        addComponent(eId, { isInFov: {}, isRevealed: {} });
      });
    }
  });
};
