import { type Entity, addComponent, getEntity, getQuery } from "../engine";
import { QueryTypes } from "../queries";

export const effectsSystem = () => {
  const hasActiveEffectsQuery = getQuery(QueryTypes.HasActiveEffects);

  hasActiveEffectsQuery.entities.forEach((eId) => {
    const entity = getEntity(eId);
    if (!entity) return;

    // for each effect that is active
    // apply delta to component
    for (const [index, effect] of entity.components.activeEffects!.entries()) {
      const { component, delta } = effect;

      // make sure entity has affected component
      if (!entity.components[component]) return;
      // apply delta
      entity.components[component]!.current += delta;

      // prevent effect from setting current above max
      if (
        entity.components[component]!.current >
        entity.components[component]!.max
      ) {
        entity.components[component]!.current =
          entity.components[component]!.max;
      }

      if (effect.duration <= 0) {
        // remove active effect if duration is complete
        entity.components.activeEffects!.splice(index, 1);
      } else {
        // reduce duration by one
        effect.duration -= 1;
      }
    }
  });
};
