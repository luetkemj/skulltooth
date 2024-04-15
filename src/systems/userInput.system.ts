import { addComponent, destroyEntity, getEntity, getQuery } from "../engine";
import { toPosId } from "../lib/grid";
import { addItem, dropItem, throwItem } from "../lib/inventory";
import { GameState, Turn, getState, setState, State } from "../main";
import { QueryTypes } from "../queries";
import { addLog, addEffectsToEntity, outOfBounds } from "../lib/utils";

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

    if (key === "L") {
      setState((state: State) => (state.gameState = GameState.INSPECT));
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
        addLog("There is nothing to pickup");
      }
    }
  }

  if (gameState === GameState.INSPECT || gameState === GameState.TARGET) {
    if (gameState === GameState.INSPECT) {
      if (key === "L" || key === "Escape") {
        setState((state: State) => (state.gameState = GameState.GAME));
      }
    }
    if (gameState === GameState.TARGET) {
      if (key === "Escape") {
        setState((state: State) => (state.gameState = GameState.INVENTORY));
      }
    }

    if (moveKeys.includes(key)) {
      if (playerEntity?.components.position) {
        const oldPos = getState().cursor[1];
        const { x, y, z } = oldPos;

        if (key === "h" || key === "ArrowLeft") {
          const newPos = { x: x - 1, y, z };
          if (outOfBounds(newPos)) return;
          setState((state: State) => {
            state.cursor = [oldPos, newPos];
          });
        }
        if (key === "j" || key === "ArrowDown") {
          const newPos = { x, y: y + 1, z };
          if (outOfBounds(newPos)) return;
          setState((state: State) => {
            state.cursor = [oldPos, newPos];
          });
        }
        if (key === "k" || key === "ArrowUp") {
          const newPos = { x, y: y - 1, z };
          if (outOfBounds(newPos)) return;
          setState((state: State) => {
            state.cursor = [oldPos, newPos];
          });
        }
        if (key === "l" || key === "ArrowRight") {
          const newPos = { x: x + 1, y, z };
          if (outOfBounds(newPos)) return;
          setState((state: State) => {
            state.cursor = [oldPos, newPos];
          });
        }
      }
    }
  }

  if (gameState === GameState.INVENTORY) {
    if (key === "i" || key === "Escape") {
      setState((state: State) => (state.gameState = GameState.GAME));
    }

    // consume item
    if (key === "c") {
      if (!playerEntity.components.inventory) return;
      // get first item in inventory
      const [itemEId] = playerEntity.components.inventory;
      const itemEntity = getEntity(itemEId);
      if (!itemEntity) return;
      if (!itemEntity.components.effects) return;

      // Use consumable
      addEffectsToEntity(itemEntity.components.effects, playerEntity);
      // remove item from inventory
      playerEntity.components.inventory.delete(itemEId);
      addLog(`You consume the ${itemEntity.components.name}.`);
      // destroy the entity
      destroyEntity(itemEntity.id);
    }

    // drop item
    if (key === "d") {
      if (!playerEntity.components.inventory) return;

      // get first item in inventory
      const [itemEId] = playerEntity.components.inventory;
      const itemEntity = getEntity(itemEId);
      if (!itemEntity) return;

      // drop item
      dropItem(itemEId, playerEntity.id);
      addLog(`You drop a ${itemEntity.components.name}`);
    }

    // throw item
    if (key === "t") {
      if (!playerEntity.components.inventory) return;

      // get first item in inventory
      const [itemEId] = playerEntity.components.inventory;
      const itemEntity = getEntity(itemEId);
      if (!itemEntity) return;

      // throw item
      // enter target mode
      setState((state: State) => (state.gameState = GameState.TARGET));
      // throwItem (drop) at specific location
      // how to damage enemies?
      // dropItem(itemEId, playerEntity.id);
      // addLog(`You threw a ${itemEntity.components.name}`);
    }
  }

  if (gameState === GameState.TARGET) {
    if (key === "Enter") {
      // get first item in inventory
      if (!playerEntity.components.inventory) return;
      const [itemEId] = playerEntity.components.inventory;
      const itemEntity = getEntity(itemEId);
      if (!itemEntity) return;

      throwItem(itemEId, playerEntity.id, getState().cursor[1]);
      addLog(`You threw a ${itemEntity.components.name}`);

      setState((state: State) => {
        state.gameState = GameState.GAME;
        state.turn = Turn.WORLD;
      });
    }
  }

  setState((state: State) => {
    state.userInput = null;
  });
};
