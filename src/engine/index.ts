let _id = 0;

export const createId = () => ++_id + Math.random().toString(36).slice(2, 10);

type PositionComponent = {
  x: string;
  y: string;
  z: string;
};

type Components = {
  position?: PositionComponent;
};

type Entity = {
  id: string;
  wId: string;
  components: Components;
};

export const entities = new Map();

export const destroyAllEntities = () => {
    entities.clear()
    destroyAllWorlds()
}

export const createEntity = ({
  eId,
  wId,
}: {
  eId?: string;
  wId: string;
}): Entity => {
  const _eId = eId || createId();
  const entity = {
    id: _eId,
    wId: "",
    components: {},
  };

  // add to entities Map
  entities.set(_eId, entity);

  worlds[wId].add(_eId);

  return entity;
};

export const systems = {};

export const worlds: { [key: string]: Set<string> } = {};

type World = Set<string>;

export const createWorld = ({
  wId,
  world,
}: {
  wId: string;
  world?: Set<string>;
}): World => {
  const _wid = wId || createId();
  const _world = world || new Set();
  worlds[_wid] = _world;

  return _world;
};

export const getWorld = (wId: string): World => {
  return worlds[wId];
};

export const destroyAllWorlds = () => {
    const keys = Object.keys(worlds)
    keys.forEach(key => delete worlds[key])
}

export const resetEngine = () => {
   destroyAllWorlds()
   destroyAllEntities()
}
