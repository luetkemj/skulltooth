import { Entity, getEntity, getQuery } from "../engine";
import { QueryTypes } from "../queries";
import { distance } from "../lib/grid";
import { setState, State } from "../main";

export const legendSystem = () => {
  const isLegendableQuery = getQuery(QueryTypes.IsLegendable);
  const isPlayerQuery = getQuery(QueryTypes.IsPlayer);

  // get player entity
  const [playerEId] = isPlayerQuery.entities;
  const playerEntity = getEntity(playerEId);
  if (!playerEntity) return;

  // build an array of legendable entities.
  const entities: Array<Entity> = [playerEntity];

  isLegendableQuery.entities.forEach((eId) => {
    const entity = getEntity(eId);

    if (!entity) return

    if (entity.id === playerEntity.id) return

    if (entity) {
      entities.push(entity);
    }
  });

  // sort by distance from player
  const posP = playerEntity.components.position!;

  entities.sort(entity => distance(posP, entity.components.position!))

  setState((state:State) => {
    state.legend = entities.map(entity => entity.id)
  })
  // generate the text structure...
  // let the render system deal with rendering them on the page
};
