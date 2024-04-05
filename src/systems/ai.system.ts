import { type Entity, addComponent, getEntity, getQuery } from "../engine";
import { QueryTypes } from "../queries";
import { aStar } from "../lib/pathfinding";

export const aiSystem = () => {
  const isPlayerQuery = getQuery(QueryTypes.IsPlayer);
  const hasAiQuery = getQuery(QueryTypes.HasAi);

  let player: Entity;
  isPlayerQuery.entities.forEach((eId) => {
    const entity = getEntity(eId);
    if (!entity) return;

    player = entity;
  });

  hasAiQuery.entities.forEach((eId) => {
    const entity = getEntity(eId);
    if (!entity?.components.position) return;
    if (!player?.components.position) return;

    const path = aStar(entity.components.position, player.components.position);
    
    // if no path was found we should bail
    if (!path[1]) return

    const newPos = {
      x: path[1][0],
      y: path[1][1],
      z: entity.components.position.z,
    };

    addComponent(entity.id, {
      tryMove: newPos,
    });
  });
};
