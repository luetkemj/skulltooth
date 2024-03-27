import { getQuery, addComponent, removeComponent } from "../engine";
import { ComponentTypes } from "../engine/index.types";
import { getState } from "../main";
import { type Pos } from "../lib/grid";
import createFOV from "../lib/fov";
import { QueryTypes } from "../queries";

export const fovSystem = (origin: Pos) => {
  const inFovQuery = getQuery(QueryTypes.IsInFov);
  const opaqueQuery = getQuery(QueryTypes.IsOpaque);

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
