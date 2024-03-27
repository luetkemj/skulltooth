import { createQuery } from "./engine";
import { ComponentTypes } from "./engine/index.types";

export enum QueryTypes {
  HasAppearance = "hasAppearance",
  IsInFov = 'isInFov',
  IsOpaque = 'isOpaque',
  IsPlayer = "isPlayer",
  IsTryingToMove = "isTryingToMove",
}

export const createQueries = () => {
  createQuery(QueryTypes.HasAppearance, {
    any: [],
    all: [ComponentTypes.Appearance, ComponentTypes.Appearance],
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
