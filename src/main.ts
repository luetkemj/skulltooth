import { mean } from "lodash";
import { pxToPosId, setupCanvas, View } from "./lib/canvas";
import "./style.css";
import { aiSystem } from "./systems/ai.system";
import { fovSystem } from "./systems/fov.system";
import { legendSystem } from "./systems/legend.system";
import { movementSystem } from "./systems/movement.system";
import { renderSystem } from "./systems/render.system";
import { userInputSystem } from "./systems/userInput.system";
import {
  type WId,
  type EId,
  type EIds,
  type Entity,
  createWorld,
  getEngine,
  getEntity,
} from "./engine";
import { createItem, createOwlbear, createPlayer } from "./actors";
import { createQueries } from "./queries";
import { generateDungeon } from "./pcgn/dungeon";
import { toPosId } from "./lib/grid";
import { addItem } from "./lib/inventory";

import { aStar } from "./lib/pathfinding";

const enum Turn {
  PLAYER = "PLAYER",
  WORLD = "WORLD",
}

export const enum GameState {
  GAME = "GAME",
  GAME_OVER = "GAME_OVER",
  INVENTORY = "INVENTORY",
}

type EAP = { [key: string]: EIds };

export type State = {
  eAP: EAP;
  fps: number;
  toRender: Set<string>;
  turn: Turn;
  userInput: KeyboardEvent | null;
  views: {
    fps?: View;
    map?: View;
    log?: View;
    senses?: View;
    legend?: View;
    inventory?: View;
    overlay?: View;
  };
  wId: WId;
  playerEId: EId;
  z: number;
  gameState: GameState;
  log: Array<string>;
  senses: {
    feel: string;
    see: string;
    hear: string;
    smell: string;
    taste: string;
  };
  legend: Array<string>;
};

// for debugging
declare global {
  interface Window {
    skulltooth: {
      state: State;
      getEngine: Function;
      getEntity: Function;
      debug: Boolean;
    };
  }
}
window.skulltooth = window.skulltooth || {};
window.skulltooth.getEngine = () => getEngine();
window.skulltooth.debug = false;
window.skulltooth.getEntity = (eId: string) => getEntity(eId);

const state: State = {
  eAP: {},
  fps: 0,
  toRender: new Set(),
  turn: Turn.WORLD,
  userInput: null,
  views: {},
  wId: "",
  playerEId: "",
  z: 0,
  gameState: GameState.GAME,
  log: [
    "Welcome to Skulltooth! Your destiny awaits and we will keep describingthat for a long time!",
    "The skulltooth awaits",
    "Seek it's wisdom if you dare",
    "Use your senses to survive",
    "Good luck...",
  ],
  senses: {
    feel: "You feel nothing.",
    see: "You see nothing.",
    hear: "You hear nothing.",
    smell: "You smell nothing.",
    taste: "You taste nothing.",
  },
  legend: [],
};

window.skulltooth.state = state;

export const setState = (callback: Function): void => {
  callback(state);
};

export const getState = (): State => state;

export const addEAP = (entity: Entity): State => {
  if (entity.components.position) {
    const posId = toPosId(entity.components.position);
    if (state.eAP[posId]) {
      state.eAP[posId].add(entity.id);
    } else {
      state.eAP[posId] = new Set();
      state.eAP[posId].add(entity.id);
    }
  }

  return state;
};

export const removeEAP = (entity: Entity): State => {
  if (entity.components.position) {
    const posId = toPosId(entity.components.position);
    if (state.eAP[posId]) {
      state.eAP[posId].delete(entity.id);
    }
  }

  return state;
};

const init = async () => {
  await setupCanvas(document.querySelector<HTMLCanvasElement>("#canvas")!);

  const world = createWorld();

  setState((state: State) => {
    state.wId = world.id;
  });

  createQueries();
  const dungeon = generateDungeon();
  const startingPosition = dungeon!.rooms[0].center;

  const player = createPlayer(getState().wId, startingPosition);
  setState((state: State) => {
    state.playerEId = player.id;
  });

  const item = createItem(getState().wId);
  addItem(item.id, player.id);

  dungeon!.rooms.forEach((room, index) => {
    if (index) {
      // createOwlbear(getState().wId, room.center);
      createItem(getState().wId, room.center);
    }
  });

  new View({
    width: 12,
    height: 2,
    x: 0,
    y: 0,
    layers: 2,
    tileSets: ["tile", "text"],
    tints: [0xffffff, 0xff0077],
    alphas: [1, 1],
    visible: true,
  }).updateRows([
    [{}, { string: " skulltooth" }],
    [{ tint: 0xff0077 }, { string: "forcecrusher", tint: 0xffffff }],
  ]);

  const legendView = new View({
    width: 25,
    height: 42,
    x: 0,
    y: 2,
    layers: 1,
    tileSets: ["text"],
    tints: [0xff0077],
    alphas: [1],
    visible: true,
  });

  const logView = new View({
    width: 74,
    height: 5,
    x: 26,
    y: 0,
    layers: 1,
    tileSets: ["text"],
    tints: [0xeeeeee],
    alphas: [1],
    visible: true,
  });

  const sensesView = new View({
    width: 74,
    height: 5,
    x: 100,
    y: 0,
    layers: 1,
    tileSets: ["text"],
    tints: [0xff0077],
    alphas: [1],
    visible: true,
  });

  // 3 render layers
  // 1: background
  // 2: character
  // 3: foreground
  const mapView = new View({
    width: 74,
    height: 39,
    x: 13,
    y: 5,
    layers: 3,
    tileSets: ["tile", "ascii", "tile"],
    tints: [0x000000, 0x000000, 0x000000],
    alphas: [1, 1, 0],
    visible: true,
  });

  const fpsView = new View({
    width: 12,
    height: 1,
    x: 0,
    y: 44,
    layers: 1,
    tileSets: ["text"],
    tints: [0xdddddd],
    alphas: [1],
    visible: true,
  }).updateRows([[{ string: "FPS: calc..." }]]);

  new View({
    width: 12,
    height: 1,
    x: 0,
    y: 45,
    layers: 1,
    tileSets: ["text"],
    tints: [0xffffff],
    alphas: [1],
    visible: true,
  }).updateRows([[{ string: "TAG: GITHASH" }]]);

  // keyboard controls
  new View({
    width: 148,
    height: 2,
    x: 26,
    y: 44,
    layers: 1,
    tileSets: ["text"],
    tints: [0xeeeeee],
    alphas: [1],
    visible: true,
  }).updateRows([[], [{ string: "(arrows / hjkl) Move (i) Inventory" }]]);

  // MENUS
  // menu overlay (goes over game view, below menu views)
  const overlayView = new View({
    width: 100,
    height: 46,
    x: 0,
    y: 0,
    layers: 1,
    tileSets: ["tile"],
    tints: [0x111111],
    alphas: [0.75],
    visible: false,
  });

  // Inventory Menu
  const inventoryView = new View({
    width: 148,
    height: 39,
    x: 26,
    y: 5,
    layers: 2,
    tileSets: ["tile", "text"],
    tints: [0x111111, 0xffffff],
    alphas: [1],
    visible: false,
  });

  setState((state: State) => {
    state.views.fps = fpsView;
    state.views.map = mapView;
    state.views.log = logView;
    state.views.senses = sensesView;
    state.views.legend = legendView;
    state.views.inventory = inventoryView;
    state.views.overlay = overlayView;
  });

  const start = dungeon!.rooms[0].center;
  const goal = dungeon!.rooms[1].center;
  aStar(start, goal);

  // initialize some systems at game start
  {
    fovSystem();
    legendSystem();
    renderSystem();
  }

  gameLoop();

  document.addEventListener("keydown", (ev) => {
    setState((state: State) => {
      state.userInput = ev;
    });
  });

  // log entities on mouseclick at position
  document.addEventListener("mousedown", (ev: any) => {
    const x = ev.x - state.views.map!.layers[0].x;
    const y = ev.layerY - state.views.map!.layers[0].y;
    const z = state.z;

    const posId = pxToPosId(x, y, z);

    if (!state.eAP[posId]) return;

    if (window.skulltooth.debug === true || import.meta.env.DEV) {
      state.eAP[posId].forEach((eId) => {
        console.log(getEntity(eId));
      });
    }
  });
};

let fps = 0;
let now = Date.now();
let fpsSamples: Array<Number> = [];

function gameLoop() {
  requestAnimationFrame(gameLoop);

  if (getState().gameState === GameState.INVENTORY) {
    if (getState().userInput && getState().turn === Turn.PLAYER) {
      userInputSystem();
      fovSystem();
      legendSystem();
      renderSystem();
    }
  }

  if (getState().gameState === GameState.GAME) {
    // systems
    if (getState().userInput && getState().turn === Turn.PLAYER) {
      userInputSystem();
      movementSystem();
      fovSystem();
      legendSystem();
      renderSystem();

      setState((state: State) => {
        state.turn = Turn.WORLD;
      });
    }

    if (getState().turn === Turn.WORLD) {
      aiSystem();
      movementSystem();
      fovSystem();
      legendSystem();
      renderSystem();

      setState((state: State) => {
        state.turn = Turn.PLAYER;
      });
    }
  }

  if (getState().gameState === GameState.GAME_OVER) {
    // systems
    // THE GAME IS OVER
    // console.log('game over')
  }

  // Track FPS
  {
    if (!now) {
      now = Date.now();
    }
    if (Date.now() - now > 1000) {
      fpsSamples.unshift(fps);
      if (fpsSamples.length > 3) {
        fpsSamples.pop();
      }

      if (!isNaN(getState().fps)) {
        getState().views.fps?.updateRow({
          string: `FPS: ${getState().fps}     `,
          layer: 0,
          x: 0,
          y: 0,
          tileSet: "text",
        });
      }

      now = Date.now();
      fps = 0;
    }

    setState((state: State) => (state.fps = Math.round(mean(fpsSamples))));
    fps++;
  }
}

init();
