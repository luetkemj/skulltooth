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
export enum ComponentTypes {
  Appearance = "appearance",
  Position = "position",
  IsBlocking = "isBlocking",
}
export type Components = {
  appearance?: AppearanceComponent;
  position?: PositionComponent;
  isBlocking?: {};
};

export type Entity = {
  id: EId;
  wId: WId;
  components: Components;
};

export type Entities = Map<EId, Entity>;

export type EId = string;

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

export type WId = string;

export type World = Set<string>;

export type Worlds = { [key: string]: Set<EId> };

export interface CreateEntity {
  eId?: EId;
  wId: WId;
}

export interface CreateWorld {
  wId: WId;
  world?: World;
}
