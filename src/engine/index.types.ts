export type PositionComponent = {
  x: string;
  y: string;
  z: string;
};

export type Components = {
  position?: PositionComponent;
};

export type Entity = {
  id: EId;
  wId: WId;
  components: Components;
};

export type EId = string;
export type WId = string;

export type World = Set<string>;

export type Worlds = { [key: string]: Set<EId> }

export interface CreateEntity {
  eId?: EId;
  wId: WId;
}

export interface CreateWorld {
  wId: WId;
  world?: World;
}
