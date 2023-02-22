import { getState } from "../main";
import { getEntity, getQuery } from "../engine";

export const renderSystem = () => {
  const isPlayerQuery = getQuery("isPlayerQuery");
  console.log(isPlayerQuery);

  isPlayerQuery.entities.forEach((eId) => {
    const { map: mapView } = getState().views;

    const entity = getEntity(eId);
    if (!entity) return;

    const { char, tint } = entity.components.appearance!;
    const { x, y } = entity.components.position!;

    mapView?.updateCell({
      1: { char, tint, alpha: 1, tileSet: "ascii", x, y },
    });
  });
};
