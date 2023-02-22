import { every, some } from "lodash";

import {
  Components,
  CreateEntity,
  CreateWorld,
  EId,
  Entity,
  Entities,
  Filters,
  Query,
  Queries,
  WId,
  World,
  Worlds,
  ComponentTypes,
} from "./index.types";

let _id = 0;
export const entities: Entities = new Map();
export const worlds: Worlds = {};
export const queries: Queries = {};

export const createId = () => ++_id + Math.random().toString(36).slice(2, 10);

/////////
// QUERY
/////////
export const getQueries = () => queries;
export const getQuery = (queryName: string) => queries[queryName];
export const createQuery = (queryName: string, filters: Filters) => {
  const query: Query = {
    name: queryName,
    filters,
    entities: new Set(),
  };

  queries[queryName] = query;

  return queries;
};

export const destroyAllQueries = () => {
  const keys = Object.keys(queries);
  keys.forEach((key) => delete queries[key]);
};

export const matchQueryAll = (eId: EId, queryName: string) => {
  const filter = queries[queryName].filters.all;
  if (filter.length) {
    const entity = getEntity(eId);
    if (!entity) throw `entity ${eId} does not exist`;

    return every(
      filter,
      (componentName: ComponentTypes) => entity.components[componentName]
    );
  }
  return true;
};

export const matchQueryAny = (eId: EId, queryName: string) => {
  const filter = queries[queryName].filters.any;
  if (filter.length) {
    const entity = getEntity(eId);
    if (!entity) throw `entity ${eId} does not exist`;

    return some(
      filter,
      (componentName: ComponentTypes) => entity.components[componentName]
    );
  }
  // is this what I want?
  return true;
};

export const matchQueryNone = (eId: EId, queryName: string) => {
  const filter = queries[queryName].filters.none;
  if (filter.length) {
    const entity = getEntity(eId);
    if (!entity) throw `entity ${eId} does not exist`;

    return every(
      filter,
      (componentName: ComponentTypes) => !entity.components[componentName]
    );
  }
  // is this what I want?
  return true;
};

export const matchQuery = (eId: EId, queryName: string) => {
  const query = queries[queryName];
  if (
    matchQueryAll(eId, queryName) &&
    matchQueryAny(eId, queryName) &&
    matchQueryNone(eId, queryName)
  ) {
    query.entities.add(eId);
  } else {
    query.entities.delete(eId);
  }

  return query.entities;
};

export const matchAllQueries = (eId: EId) => {
  const queryNames = Object.keys(queries);
  queryNames.forEach((queryName) => matchQuery(eId, queryName));
};

/////////
// WORLD
/////////
export const createWorld = (opts?: CreateWorld): World => {
  const _wId = opts?.wId || createId();
  const _eIds = opts?.eIds || new Set();
  const world = { id: _wId, eIds: _eIds };
  worlds[_wId] = world;

  return world;
};

export const getWorld = (wId: WId): World => {
  return worlds[wId];
};

export const getWorlds = () => worlds;

export const destroyWorld = (wId: WId) => {
  const it = worlds[wId].eIds.values();
  let result = it.next();
  while (!result.done) {
    destroyEntity(result.value);
    result = it.next();
  }

  delete worlds[wId];
};

export const destroyAllWorlds = () => {
  const keys = Object.keys(worlds);
  keys.forEach((key) => delete worlds[key]);
};

/////////
// ENTITY
/////////
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
  worlds[wId].eIds.add(_eId);

  return entity;
};

export const getEntity = (eId: EId): Entity | undefined => entities.get(eId);

export const getEntities = () => entities;

export const destroyEntity = (eId: EId) => {
  const entity = getEntity(eId);
  if (!entity) return;

  worlds[entity.wId].eIds.delete(eId);
  entities.delete(entity.id);
};

export const destroyAllEntities = () => {
  entities.forEach((entity) => destroyEntity(entity.id));
};

/////////
// COMPONENT
/////////
// TODO: deal with queries... these need to add and remove parent entity as they are added/removed
export const addComponent = (eId: EId, component: Components) => {
  // get entity
  const entity = getEntity(eId);
  if (!entity) throw `entity ${eId} does not exist`;
  // add component to entity
  Object.assign(entity.components, component);

  matchAllQueries(eId);

  return entity;
};

export const removeComponent = (eId: EId, componentName: ComponentTypes) => {
  // get entity
  const entity = getEntity(eId);
  if (!entity) throw `entity ${eId} does not exist`;
  // add component to entity
  delete entity.components[componentName];

  matchAllQueries(eId);

  return entity;
};

/////////
// SYSTEM
/////////

/////////
// ENGINE
/////////
export const resetEngine = () => {
  destroyAllEntities();
  destroyAllWorlds();
  destroyAllQueries();
  _id = 0;
};

export const stringifyEntities = (entities: Entities) => {
  return JSON.stringify([...entities]);
};

export const parseEntities = (json: any) => {
  return new Map(JSON.parse(json));
};

export const stringifyWorlds = (worlds: Worlds) => {
  const obj: {
    [key: WId]: {
      id: WId;
      eIds: Array<EId>;
    };
  } = {};
  const wIds = Object.keys(worlds);
  wIds.forEach((wId) => {
    obj[wId] = { id: wId, eIds: [...worlds[wId].eIds] };
  });
  return JSON.stringify(obj);
};

export const parseWorlds = (json: any) => {
  const data = JSON.parse(json);
  const worlds = Object.keys(data).reduce((acc: Worlds, key: WId) => {
    acc[key] = { id: key, eIds: new Set(data[key].eIds) };
    return acc;
  }, {});
  return worlds;
};

export const getEngineSnapshot = () => {
  const snapshot = {
    entities: stringifyEntities(entities),
    worlds: stringifyWorlds(worlds),
    _id,
  };

  return JSON.stringify(snapshot);
};

export const getEngineFromSnapshot = (snapshot) => {
    const {_id, entities, worlds} = JSON.parse(snapshot)
    return {
        entities: parseEntities(entities),
        worlds: parseWorlds(worlds),
        _id,
    }
}

export const getRawEngineSnapshot = () => {
    return {
        entities,
        worlds,
        _id,
    }
}

export const getEngine = () => {
    return {
        entities,
        worlds,
        queries,
        _id,
    }
}
