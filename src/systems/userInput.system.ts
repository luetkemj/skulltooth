import { addComponent, getEntity, getQuery } from "../engine";
import { toPosId } from "../lib/grid";
import { getState, setState, State } from "../main";
import { QueryTypes } from "../queries";

export const userInputSystem = () => {
  const { userInput } = getState();
  const query = getQuery(QueryTypes.IsPlayer);

  if (!userInput)
    return setState((state: State) => {
      state.userInput = null;
    });

  const { key } = userInput;

  query.entities.forEach((eId) => {
    const entity = getEntity(eId);

    if (entity?.components.position) {
      // ensure the previous location is rerendered.
      setState((state: State) => {
        state.toRender.add(toPosId(entity.components.position!));
      });

      const { x, y, z } = entity.components.position;

      if (key === "h" || key === "ArrowLeft") {
        const newPos = { x: x - 1, y, z };
        addComponent(eId, { tryMove: newPos });
      }
      if (key === "j" || key === "ArrowDown") {
        const newPos = { x, y: y + 1, z };
        addComponent(eId, { tryMove: newPos });
      }
      if (key === "k" || key === "ArrowUp") {
        const newPos = { x, y: y - 1, z };
        addComponent(eId, { tryMove: newPos });
      }
      if (key === "l" || key === "ArrowRight") {
        const newPos = { x: x + 1, y, z };
        addComponent(eId, { tryMove: newPos });
      }
    }
  });

  setState((state: State) => {
    state.userInput = null;
  });
};
