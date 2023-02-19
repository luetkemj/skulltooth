import { CreateEntity, CreateWorld, EId, WId, Entity, World, Worlds } from "./index.types";

let _id = 0;
export const entities = new Map();
export const systems = {};
export const worlds: Worlds = {};

export const createId = () => ++_id + Math.random().toString(36).slice(2, 10);

export const createWorld = ({
  wId,
  world,
}: CreateWorld): World => {
  const _wid = wId || createId();
  const _world = world || new Set();
  worlds[_wid] = _world;

  return _world;
};

export const getWorld = (wId: WId): World => {
  return worlds[wId];
};

export const getWorlds = () => worlds

export const destroyWorld = (wId: WId) => {
    const it = worlds[wId].values()    
    let result = it.next()
    while (!result.done) {
        destroyEntity(result.value)
        result = it.next()
    }

    delete worlds[wId]
}

export const createEntity = ({ eId, wId }: CreateEntity): Entity => {
  const _eId = eId || createId();
  const entity = {
    id: _eId,
    wId,
    components: {},
  };

  // add entity to entities
  entities.set(_eId, entity);

  // add eId to world
  worlds[wId].add(_eId);

  return entity;
};

export const getEntity = (eId: EId) => entities.get(eId)
export const getEntities = () => entities

export const destroyEntity = (eId: EId) => { 
    const entity = getEntity(eId)
    worlds[entity.wId].delete(eId)
    entities.delete(entity.id)
}

export const destroyAllEntities = () => {
  entities.forEach((entity) => destroyEntity(entity.id));
};

export const destroyAllWorlds = () => {
  const keys = Object.keys(worlds);
  keys.forEach((key) => delete worlds[key]);
};

export const resetEngine = () => {
  destroyAllEntities();
  destroyAllWorlds();
  _id = 0
};
