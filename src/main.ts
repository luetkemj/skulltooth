import { mean } from "lodash";
import { setupCanvas, View } from "./canvas";
import "./style.css";
import { userInputSystem } from "./systems/userInput.system";
import { renderSystem } from "./systems/render.system";
import { createWorld, getEngine } from "./engine";
import { WId } from "./engine/index.types";
import { createPlayer } from "./prefabs/player.prefab";
import { createQueries } from "./queries";

const enum Turn {
  PLAYER = "PLAYER",
  WORLD = "WORLD",
}

export type State = {
  fps: number;
  turn: Turn;
  userInput: KeyboardEvent | null;
  wId: WId;
  views: {
    fps?: View;
    map?: View;
  };
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
  fps: 0,
  turn: Turn.PLAYER,
  userInput: null,
  views: {},
  wId: "",
};

window.skulltooth.state = state;

export const setState = (callback: Function): void => {
  callback(state);
};

export const getState = (): State => state;

const init = async () => {
  await setupCanvas(document.querySelector<HTMLCanvasElement>("#canvas")!);

  const world = createWorld();

  setState((state: State) => {
    state.wId = world.id;
  });

  createQueries();

  createPlayer(getState().wId);

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

  const mapView = new View({
    width: 74,
    height: 39,
    x: 13,
    y: 3,
    layers: 2,
    tileSets: ["tile", "ascii", "tile"],
    tints: [0x222222, 0x222222, 0x000000],
    alphas: [1, 1, 0],
  }).updateCell({
    1: { char: "@", tint: 0xffffff, alpha: 1, tileSet: "ascii", x: 10, y: 10 },
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
    renderSystem();

    setState((state: State) => {
      state.turn = Turn.WORLD;
    });
  }

  if (getState().turn === Turn.WORLD) {
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
