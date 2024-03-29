import { State, getState, setState } from "../main";
import { getEntity, getQuery } from "../engine";
import { QueryTypes } from "../queries";
import { toPos } from "../lib/grid";

// this is not doing anything to reduce the cells that need to be rendered.
// if things slow down or we run into other issues we will need to expand onor use the toRender info from state - not really using that yet.

export const renderSystem = () => {
  const inFov = getQuery(QueryTypes.IsInFov);
  const isRevealed = getQuery(QueryTypes.IsRevealed);
  const isPlayer = getQuery(QueryTypes.IsPlayer);

  const { map: mapView } = getState().views;

  for (const eId of isRevealed.entities) {
    const entity = getEntity(eId);
    if (!entity) return;

    const { char, tint } = entity.components.appearance!;
    const { x, y } = entity.components.position!;

    mapView?.updateCell({
      0: { char, tint, alpha: 0.35, tileSet: "ascii", x, y },
    });
  }

  for (const eId of inFov.entities) {
    const entity = getEntity(eId);
    if (!entity) return;

    const { char, tint } = entity.components.appearance!;
    const { x, y } = entity.components.position!;

    mapView?.updateCell({
      0: { char, tint, alpha: 1, tileSet: "ascii", x, y },
    });
  }

  for (const eId of isPlayer.entities) {
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

    // // for debugging
    // const hasAppearance = getQuery(QueryTypes.HasAppearance);
    // for (const eId of hasAppearance.entities) {
    //   const entity = getEntity(eId);
    //   if (!entity) return;
    //
    //   const { char, tint } = entity.components.appearance!;
    //   const { x, y } = entity.components.position!;
    //
    //   mapView?.updateCell({
    //     0: { char, tint, alpha: 1, tileSet: "ascii", x, y },
    //   });
    // }
    // end debug section

    setState((state: State) => (state.toRender = new Set()));
  }
};
