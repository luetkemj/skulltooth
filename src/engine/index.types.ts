type AppearanceComponent = {
  char: string;
  tint: number;
  tileSet: string;
};

type PositionComponent = {
  x: number;
  y: number;
  z: number;
};

type TryMoveComponent = {
  x: number;
  y: number;
  z: number;
};

export enum ComponentTypes {
  Ai = "ai",
  Appearance = "appearance",
  IsBlocking = "isBlocking",
  IsInFov = "isInFov",
  IsOpaque = "isOpaque",
  IsPlayer = "isPlayer",
  IsRevealed = "isRevealed",
  PathThrough = "pathThrough",
  Position = "position",
  TryMove = "tryMove",
}

export type Components = {
  ai?: {},
  appearance?: AppearanceComponent;
  isBlocking?: {};
  isInFov?: {};
  isOpaque?: {};
  isPlayer?: {};
  isRevealed?: {};
  layer100?: {}; // ground layer
  layer200?: {}; // item layer
  layer300?: {}; // actor layer
  pathThrough: {};
  position?: PositionComponent;
  tryMove?: TryMoveComponent;
};

export type EId = string;
export type EIds = Set<EId>;
export type Entity = { id: EId; wId: WId; components: Components };
export type Entities = Map<EId, Entity>;

export type WId = string;
export type WIds = Set<WId>;
export type World = { id: WId; eIds: EIds };
export type Worlds = { [key: WId]: World };

export type Queries = {
  [key: string]: Query;
};

export type Filters = {
  all: Array<string>;
  any: Array<string>;
  none: Array<string>;
};

export type Query = {
  name: string;
  filters: Filters;
  entities: Set<EId>;
};

export interface CreateEntity {
  eId?: EId;
  wId: WId;
}

export interface CreateWorld {
  wId: WId;
  eIds?: EIds;
}
