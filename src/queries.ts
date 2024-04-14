import { ComponentTypes, createQuery } from "./engine";

export enum QueryTypes {
  HasActiveDamages = "hasActiveDamages",
  HasActiveEffects = "hasActiveEffects",
  HasAi = "hasAi",
  HasAppearance = "hasAppearance",
  IsInFov = "isInFov",
  IsLegendable = "isLegendable",
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

  createQuery(QueryTypes.IsLegendable, {
    any: [],
    all: [
      ComponentTypes.IsInFov,
      ComponentTypes.Legendable,
      ComponentTypes.Position,
    ],
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

  createQuery(QueryTypes.HasActiveDamages, {
    any: [],
    all: [ComponentTypes.ActiveDamages],
    none: [],
  });

  createQuery(QueryTypes.HasActiveEffects, {
    any: [],
    all: [ComponentTypes.ActiveEffects],
    none: [],
  });
};
