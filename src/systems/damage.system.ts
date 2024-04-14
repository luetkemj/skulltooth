import { getEntity, getQuery } from "../engine";
import { QueryTypes } from "../queries";
import { addLog } from "../lib/utils";

export const damageSystem = () => {
  const hasActiveDamagesQuery = getQuery(QueryTypes.HasActiveDamages);

  hasActiveDamagesQuery.entities.forEach((eId) => {
    const entity = getEntity(eId);
    if (!entity) return;

    for (const [index, damage] of entity.components.activeDamages!.entries()) {
      const { type, delta, sourceEId } = damage;

      const sourceEntity = getEntity(sourceEId);

      // apply damage
      if (!entity.components.health) return;
      // should actually do something if the thing you try to fight has no health - about it having no effect or something.

      entity.components.health.current += delta;

      addLog(
        `${sourceEntity?.components.name} damages ${entity.components.name} for ${delta}hp of ${type}`
      );

      entity.components.activeDamages!.splice(index, 1);
    }
  });
};
