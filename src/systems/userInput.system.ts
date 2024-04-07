import { addComponent, getEntity, getQuery } from "../engine";
import { toPosId } from "../lib/grid";
import { GameState, getState, setState, State } from "../main";
import { QueryTypes } from "../queries";

const moveKeys = [
  "ArrowLeft",
  "ArrowDown",
  "ArrowUp",
  "ArrowRight",
  "h",
  "j",
  "k",
  "l",
];

export const userInputSystem = () => {
  const { userInput, gameState } = getState();
  const query = getQuery(QueryTypes.IsPlayer);

  if (!userInput)
    return setState((state: State) => {
      state.userInput = null;
    });

  const { key } = userInput;

  if (gameState === GameState.GAME) {
    if (key === "i") {
      setState((state: State) => (state.gameState = GameState.INVENTORY));
    }

    if (moveKeys.includes(key)) {
      query.entities.forEach((eId) => {
        const entity = getEntity(eId);

        if (entity?.components.position) {
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
    }
  }

  if (gameState === GameState.INVENTORY) {
    if (key === "i" || key === 'Escape') {
      setState((state: State) => (state.gameState = GameState.GAME));
    }
  }

  setState((state: State) => {
    state.userInput = null;
  });
};
