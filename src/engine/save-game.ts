import { World } from "miniplex";
import { Entity } from './engine';

/**
 * Stringifies the world.
 * @param world
 * @returns JSON string
 */
export const saveWorld = (world: World<Entity>): string => {
  const { entities } = world;
  return JSON.stringify(entities);
};

/**
 * Parses saveData and returns world the world.
 * @param saveData
 * @returns world
 */
export const loadWorld = (saveData: string): World<Entity> => {
  const entities = JSON.parse(saveData);
  const loadedWorld = new World<Entity>(entities);
  return loadedWorld;
};

// for a more complex implementation with buffers etc...
// https://github.com/hmans/miniplex/issues/305#issuecomment-2061444881
