import { getEntity, getQuery } from "../engine";
import { getState, setState, State } from "../main";
import { QueryTypes } from "../queries";

export const userInputSystem = () => {
  const { userInput } = getState();
  const query = getQuery(QueryTypes.IsPlayer);

  if (!userInput) return setState((state: State) => {
    state.userInput = null;
  });

  const { key } = userInput;

  query.entities.forEach((eId) => {
    const entity = getEntity(eId);

    if (entity?.components.position) {
        // Fire an "event" to try move on the entity!
        // fireEvent('tryMove', eId, { x: -1, y: 0 })
        // components have an events key with the events they care about
        // fireEvent looks across all components on entity for support
        // if support is found, run the function with entity, component, payload
        // a way to encapsulate this somehow...

        if (key === 'h' || key === 'ArrowLeft') { entity.components.position.x -= 1}
        if (key === 'j' || key === 'ArrowDown') { entity.components.position.y += 1}
        if (key === 'k' || key === 'ArrowUp') { entity.components.position.y -= 1}
        if (key === 'l' || key === 'ArrowRight') { entity.components.position.x += 1}
    }
  });

  setState((state: State) => {
    state.userInput = null;
  });
};
