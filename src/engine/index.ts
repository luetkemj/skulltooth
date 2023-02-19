import { every, some } from "lodash";

import {
  Components,
  CreateEntity,
  CreateWorld,
  EId,
  Entity,
  Filters,
  Query,
  Queries,
  WId,
  World,
  Worlds,
} from "./index.types";

let _id = 0;
export const entities = new Map();
export const systems = {};
export const worlds: Worlds = {};
export const queries: Queries = {};

export const createId = () => ++_id + Math.random().toString(36).slice(2, 10);

/////////
// QUERY
/////////
export const getQueries = () => queries;
export const getQuery = (queryName: string) => queries[queryName];
export const createQuery = (
  queryName: string,
  filters: Filters, 
) => {
    const query:Query = {
        name: queryName,
        filters,
        entities: new Set()
    }

    queries[queryName] = query

    return queries
};

export const destroyAllQueries = () => {
  const keys = Object.keys(queries);
  keys.forEach((key) => delete queries[key]);
};

export const matchQueryAll = (eId: EId, queryName: string) => {
  const filter = queries[queryName].filters.all;
  if (filter.length) {
    const entity = getEntity(eId);
    return every(filter, (componentName) => entity.components[componentName]);
  }
  // is this what I want?
  return true;
};

export const matchQueryAny = (eId: EId, queryName: string) => {
  const filter = queries[queryName].filters.any;
  if (filter.length) {
    const entity = getEntity(eId);
    return some(filter, (componentName) => entity.components[componentName]);
  }
  // is this what I want?
  return true;
};

export const matchQueryNone = (eId: EId, queryName: string) => {
  const filter = queries[queryName].filters.none;
  if (filter.length) {
    const entity = getEntity(eId);
    return every(filter, (componentName) => !entity.components[componentName]);
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

  return query.entities
};

export const matchAllQueries = (eId: EId) => {
  const queryNames = Object.keys(queries);
  queryNames.forEach((queryName) => matchQuery(eId, queryName));
};

/////////
// WORLD
/////////
export const createWorld = ({ wId, world }: CreateWorld): World => {
  const _wid = wId || createId();
  const _world = world || new Set();
  worlds[_wid] = _world;

  return _world;
};

export const getWorld = (wId: WId): World => {
  return worlds[wId];
};

export const getWorlds = () => worlds;

export const destroyWorld = (wId: WId) => {
  const it = worlds[wId].values();
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
  worlds[wId].add(_eId);

  return entity;
};

export const getEntity = (eId: EId) => entities.get(eId);

export const getEntities = () => entities;

export const destroyEntity = (eId: EId) => {
  const entity = getEntity(eId);
  worlds[entity.wId].delete(eId);
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
  // add component to entity
  Object.assign(entity.components, component);

  matchAllQueries(eId)

  return entity;
};

export const removeComponent = (eId: EId, componentName: string) => {
  // get entity
  const entity = getEntity(eId);
  // add component to entity
  delete entity.components[componentName];

  matchAllQueries(eId)

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
