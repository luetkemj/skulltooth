import { mean } from "lodash";
import { setupCanvas, View } from "./lib/canvas";
import "./style.css";
import { userInputSystem } from "./systems/userInput.system";
import { aiSystem } from "./systems/ai.system";
import { renderSystem } from "./systems/render.system";
import { movementSystem } from "./systems/movement.system";
import { fovSystem } from "./systems/fov.system";
import { createWorld, getEngine } from "./engine";
import { WId, EId, EIds, Entity } from "./engine/index.types";
import { createOwlbear, createPlayer } from "./actors";
import { createQueries } from "./queries";
import { generateDungeon } from "./pcgn/dungeon";
import { toPosId } from "./lib/grid";

import { aStar } from "./lib/pathfinding";

const enum Turn {
  PLAYER = "PLAYER",
  WORLD = "WORLD",
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
  };
  wId: WId;
  playerEId: EId;
};

declare global {
  interface Window {
    skulltooth: {
      state: State;
      getEngine: Function;
    };
  }
}
window.skulltooth = window.skulltooth || {};
window.skulltooth.getEngine = () => getEngine();

const state: State = {
  eAP: {},
  fps: 0,
  toRender: new Set(),
  turn: Turn.WORLD,
  userInput: null,
  views: {},
  wId: "",
  playerEId: "",
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

  dungeon!.rooms.forEach((room, index)=> {
    if (index) {
      createOwlbear(getState().wId, room.center);
    } 
  })

  new View({
    width: 12,
    height: 2,
    x: 0,
    y: 0,
    layers: 2,
    tileSets: ["tile", "text"],
    tints: [0xffffff, 0xff0077],
    alphas: [1, 1],
  }).updateRows([
    [{}, { string: " skulltooth" }],
    [{ tint: 0xff0077 }, { string: "forcecrusher", tint: 0xffffff }],
  ]);

  // 3 render layers
  // 1: background
  // 2: character
  // 3: foreground
  const mapView = new View({
    width: 74,
    height: 39,
    x: 13,
    y: 3,
    layers: 3,
    tileSets: ["tile", "ascii", "tile"],
    tints: [0x000000, 0x000000, 0x000000],
    alphas: [1, 1, 0],
  });

  const fpsView = new View({
    width: 12,
    height: 1,
    x: 0,
    y: 42,
    layers: 1,
    tileSets: ["text"],
    tints: [0xdddddd],
    alphas: [1],
  }).updateRows([[{ string: "FPS: calc..." }]]);

  new View({
    width: 12,
    height: 1,
    x: 0,
    y: 43,
    layers: 1,
    tileSets: ["text"],
    tints: [0xffffff],
    alphas: [1],
  }).updateRows([[{ string: "TAG: GITHASH" }]]);

  setState((state: State) => {
    state.views.fps = fpsView;
    state.views.map = mapView;
  });

  const start = dungeon!.rooms[0].center;
  const goal = dungeon!.rooms[1].center;
  aStar(start, goal);

  gameLoop();

  document.addEventListener("keydown", (ev) => {
    setState((state: State) => {
      state.userInput = ev;
    });
  });
};

let fps = 0;
let now = Date.now();
let fpsSamples: Array<Number> = [];

function gameLoop() {
  requestAnimationFrame(gameLoop);

  // systems
  if (getState().userInput && getState().turn === Turn.PLAYER) {
    userInputSystem();
    movementSystem();
    fovSystem();
    renderSystem();

    setState((state: State) => {
      state.turn = Turn.WORLD;
    });
  }

  if (getState().turn === Turn.WORLD) {
    aiSystem();
    movementSystem();
    fovSystem();
    renderSystem();

    setState((state: State) => {
      state.turn = Turn.PLAYER;
    });
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
