import {
  ComponentTypes,
  Entity,
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

const moveEntity = (entity: Entity) => {
  const { x, y, z } = entity.components.tryMove!;
  removeComponent(entity.id, ComponentTypes.TryMove);

  removeEAP(entity);

  entity.components.position!.x = x;
  entity.components.position!.y = y;
  entity.components.position!.z = z;

  addEAP(entity);
};

export const movementSystem = () => {
  const isTryingToMoveQuery = getQuery(QueryTypes.IsTryingToMove);

  isTryingToMoveQuery.entities.forEach((eId) => {
    const entity = getEntity(eId);
    if (!entity) return;

    const { x, y, } = entity.components.tryMove!;

    // respect map boundaries
    const { width, height } = getState().views.map!;
    if (x < 0 || y < 0 || x >= width || y >= height) return;

    // check entities at goal position
    const posId = toPosId(entity.components.tryMove!);
    const eAP = getState().eAP[posId];

    for (const targetEId of eAP) {
      const target = getEntity(targetEId);
      if (target?.components.isBlocking) {
        if (target?.components.health) {
          target.components.health.current -= 5;
          addLog(
            `${entity.components.name} hits ${target.components.name} for 5 damage!`
          );

          if (target.components.health.current <= 0) {
            target.components.appearance!.char = "%";
            addLog(
              `${target.components.name} has been defeated by ${entity.components.name}!`
            );

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

        // target is blocking so entity cannot move.
        removeComponent(entity.id, ComponentTypes.TryMove);
        return;
      }
    }

    // Everything checks - go ahead and move
    moveEntity(entity);
  });
};
