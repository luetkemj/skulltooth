import { addComponent, getEntity, getQuery } from "../engine";
import { toPosId } from "../lib/grid";
import { addItem, dropItem } from "../lib/inventory";
import { GameState, getState, setState, State } from "../main";
import { QueryTypes } from "../queries";
import { addLog } from "../lib/utils";

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
  const queryIsPlayer = getQuery(QueryTypes.IsPlayer);

  const [playerEId] = queryIsPlayer.entities;
  const playerEntity = getEntity(playerEId);
  if (!playerEntity) return;

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
      if (playerEntity?.components.position) {
        const { x, y, z } = playerEntity.components.position;
        const eId = playerEntity.id;

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
    }

    if (key === "g") {
      // check ground for pickups
      const pos = playerEntity.components.position;
      if (!pos) return;
      // add any items at position to inventory
      const eap = getState().eAP[toPosId(pos)];

      let noPickupsFound = true;
      eap.forEach((eId) => {
        const entity = getEntity(eId);
        if (entity?.components.pickup) {
          addItem(eId, playerEntity.id);
          addLog(`You pickup ${entity.components.name}`);
          noPickupsFound = false;
        }
      });
      if (noPickupsFound) {
        addLog('There is nothing to pickup')
      }
    }
  }

  if (gameState === GameState.INVENTORY) {
    if (key === "i" || key === "Escape") {
      setState((state: State) => (state.gameState = GameState.GAME));
    }

    if (key === "d") {
      // drop first item in inventory
      if (!playerEntity.components.inventory) return;
      // if (!playerEntity.components.position) return;
      //
      const [itemEId] = playerEntity.components.inventory;
      const itemEntity = getEntity(itemEId)
      //
      if (!itemEntity) return
      // // add position to item
      // addPosition(itemEntity.id, playerEntity.components.position)
      // // remove item from inventory
      // playerEntity.components.inventory.delete(itemEId)
      // // send log
      dropItem(itemEId, playerEntity.id);
      addLog(`You drop a ${itemEntity.components.name}`)
      // if no items in inventory do nothing.
    }
  }

  setState((state: State) => {
    state.userInput = null;
  });
};
