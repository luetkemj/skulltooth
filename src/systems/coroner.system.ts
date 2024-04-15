import { addComponent, ComponentTypes, Entity, getEntity, getQuery, removeComponent } from "../engine";
import { QueryTypes } from "../queries";
import { setState, GameState, type State } from "../main";
import { addLog } from "../lib/utils";

const endGame = () => {
  setState((state: State) => (state.gameState = GameState.GAME_OVER));
  addLog("Game Over!");
};

const kill = (entity: Entity) => {
  entity.components.appearance!.char = "%";

  addLog(
    `${entity.components.name} has died!`
  );

  if (entity.components.isPlayer) {
    endGame();
  }

  removeComponent(entity.id, ComponentTypes.Ai);
  removeComponent(entity.id, ComponentTypes.IsBlocking);
  addComponent(entity.id, { isDead: {} });
};

export const coronerSystem = () => {
  const isAliveQuery = getQuery(QueryTypes.IsAlive);

  isAliveQuery.entities.forEach((eId) => {
    const entity = getEntity(eId);
    if (!entity) return;
    if (entity.components.health!.current <= 0) {
      kill(entity)
    }
  });
};

