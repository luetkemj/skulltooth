import { createQuery } from "./engine";
import { ComponentTypes } from "./engine/index.types";

export enum QueryTypes {
  IsPlayer = "isPlayer",
  IsTryingToMove = "isTryingToMove",
}

export const createQueries = () => {
  createQuery(QueryTypes.IsPlayer, {
    any: [ComponentTypes.IsPlayer],
    all: [],
    none: [],
  });

  createQuery(QueryTypes.IsTryingToMove, {
    any: [],
    all: [ComponentTypes.Position, ComponentTypes.TryMove],
    none: [],
  });
};
