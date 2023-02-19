import { mean } from "lodash";
import { setupCanvas, View } from "./canvas";
import "./style.css";

type State = {
  fps: number;
  views: {
    fps?: View;
  };
};

declare global {
  interface Window {
    skulltooth: {
      state: State;
    };
  }
}
window.skulltooth = window.skulltooth || {};

const state: State = {
  fps: 0,
  views: {},
};

window.skulltooth.state = state;

export const setState = (callback: Function): void => {
  callback(state);
};

export const getState = (): State => state;

const init = async () => {
  await setupCanvas(document.querySelector<HTMLCanvasElement>("#canvas")!);

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

  const fpsView = new View({
    width: 12,
    height: 1,
    x: 0,
    y: 42,
    layers: 1,
    tileSets: ["text"],
    tints: [0xffffff],
    alphas: [1],
  }).updateRows([[{ string: "FPS: calc..." }]]);

  setState((state: State) => {
    state.views.fps = fpsView;
  });

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

  gameLoop();
};

let fps = 0;
let now = Date.now();
let fpsSamples: Array<Number> = [];

function gameLoop() {
  requestAnimationFrame(gameLoop);

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
