import PF from "pathfinding";
import { some } from "lodash";
import { type Pos, toPos } from "./grid";
import { getState } from "../main";
import { getEntity } from '../engine/index'

export const aStar = (start: Pos, goal: Pos) => {
  const { width, height } = getState().views.map!;
  const matrix = new PF.Grid(width, height);

  const locIds = Object.keys(getState().eAP);

  locIds.forEach((locId) => {
    const cell = toPos(locId);
    if (
      some([...getState().eAP[locId]], (eId) => {
        const entity = getEntity(eId);

        if (!entity) return

        return entity.components.isBlocking;
      })
    ) {
      matrix.setWalkableAt(cell.x, cell.y, false);
    }
  });


  matrix.setWalkableAt(start.x, start.y, true);
  matrix.setWalkableAt(goal.x, goal.y, true);

  const finder = new PF.AStarFinder({});

  const path = finder.findPath(start.x, start.y, goal.x, goal.y, matrix);

  return path;
};
