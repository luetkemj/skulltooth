import { createQuery } from "./engine";
import { ComponentTypes } from "./engine/index.types";

export enum QueryTypes {
  HasAi = "hasAi",
  HasAppearance = "hasAppearance",
  IsInFov = "isInFov",
  IsOpaque = "isOpaque",
  IsPlayer = "isPlayer",
  IsRevealed = "isRevealed",
  IsTryingToMove = "isTryingToMove",
}

export const createQueries = () => {
  createQuery(QueryTypes.HasAi, {
    any: [],
    all: [ComponentTypes.Ai],
    none: [],
  });

  createQuery(QueryTypes.HasAppearance, {
    any: [],
    all: [ComponentTypes.Appearance],
    none: [],
  });

  createQuery(QueryTypes.IsInFov, {
    any: [ComponentTypes.IsInFov],
    all: [],
    none: [],
  });

  createQuery(QueryTypes.IsOpaque, {
    any: [ComponentTypes.IsOpaque],
    all: [],
    none: [],
  });

  createQuery(QueryTypes.IsRevealed, {
    any: [ComponentTypes.IsRevealed],
    all: [],
    none: [ComponentTypes.IsInFov],
  });

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
