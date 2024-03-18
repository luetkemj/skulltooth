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
  Appearance = "appearance",
  IsBlocking = "isBlocking",
  IsPlayer = "isPlayer",
  Position = "position",
  TryMove = "tryMove",
}

export type Components = {
  appearance?: AppearanceComponent;
  isBlocking?: {};
  isPlayer?: {};
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
