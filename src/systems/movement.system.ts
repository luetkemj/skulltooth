import {
  ComponentTypes,
  getEntity,
  getQuery,
  removeComponent,
} from "../engine";
import { toPosId } from "../lib/grid";
import {
  addLog,
  getState,
  addEAP,
  removeEAP,
  setState,
  GameState,
  type State,
} from "../main";
import { QueryTypes } from "../queries";

export const movementSystem = () => {
  const query = getQuery(QueryTypes.IsTryingToMove);

  query.entities.forEach((eId) => {
    const entity = getEntity(eId);
    if (!entity) return;

    const { x, y, z } = entity.components.tryMove!;

    // respect map boundaries
    const { width, height } = getState().views.map!;
    if (x < 0 || y < 0 || x >= width || y >= height) return;

    // check entities at goal position
    const posId = toPosId(entity.components.tryMove!);
    const eAP = getState().eAP[posId];

    for (const eId of eAP) {
      const target = getEntity(eId);
      if (target?.components.isBlocking) {
        if (target?.components.health) {
          target.components.health.current -= 5;
          addLog("Target has been hit for 5 damage");

          if (target.components.health.current <= 0) {
            target.components.appearance!.char = "%";
            addLog("Target has been defeated!");

            if (target.components.isPlayer) {
              setState(
                (state: State) => (state.gameState = GameState.GAME_OVER)
              );
              addLog("Game Over!");
            }

            removeComponent(target.id, ComponentTypes.Ai);
            removeComponent(target.id, ComponentTypes.IsBlocking);
          }
        }

        return; // console.log("you can go no further");
      }
    }

    removeComponent(eId, ComponentTypes.TryMove);

    // if everything checks out - update position
    // should we set this new location to toRender in state?
    // pretty sure - looks like we're just hacking the render system for now

    removeEAP(entity);

    entity.components.position!.x = x;
    entity.components.position!.y = y;
    entity.components.position!.z = z;

    addEAP(entity);
  });
};
