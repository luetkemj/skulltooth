import { getEntity, getQuery } from "../engine";
import { getState, setState, State } from "../main";

export const userInputSystem = () => {
  const { userInput } = getState();
  console.log(userInput);
  // WHY IS THIS UNDEFINED?
  const query = getQuery("isPlayer");
  console.log(query)

  if (!query) {
    return setState((state: State) => {
      state.userInput = null;
    });
  }

  query.entities.forEach(eId => {
    const entity = getEntity(eId)

    console.log(entity)
    entity.components.position.x = entity.components.position.x + 1
  })

  setState((state: State) => {
    state.userInput = null;
  });
};
