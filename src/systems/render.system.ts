import { State, getState, setState } from "../main";
import { getEntity, getQuery } from "../engine";
import { QueryTypes } from "../queries";
import { toPos } from "../grid";


export const renderSystem = () => {
  const isPlayerQuery = getQuery(QueryTypes.IsPlayer);

  isPlayerQuery.entities.forEach((eId) => {
    const { map: mapView } = getState().views;

    const entity = getEntity(eId);
    if (!entity) return;

    const { char, tint } = entity.components.appearance!;
    const { x, y } = entity.components.position!;

    mapView?.updateCell({
      1: { char, tint, alpha: 1, tileSet: "ascii", x, y },
    });

    // this is throwaway until I get the map thing done
    // reset last location to original
    getState().toRender.forEach((posId) => {
      const pos = toPos(posId);
      mapView?.updateCell({
        1: {
          char: "",
          tint: 0x000000,
          alpha: 0,
          tileSet: "ascii",
          x: pos.x,
          y: pos.y,
        },
      });
    });

    setState(( state: State ) => state.toRender = new Set())
  });
};
