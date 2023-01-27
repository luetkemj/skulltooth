import { setupCanvas, View } from "./canvas";
import "./style.css";

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
    template: [
      {},
      {
        string: "Skulltooth",
        x: 0,
        y: 1,
      },
    ],
  });

  new View({
    width: 12,
    height: 1,
    x: 0,
    y: 43,
    layers: 2,
    tileSets: ["tile", "text"],
    tints: [0xff0077, 0xff77f],
    alphas: [1, 1],
    template: [
      {
        string: "TAG: GITHASH",
        layer: 1,
        x: 0,
        y: 0,
        tileSet: "text",
        tint: 0xffffff,
        alpha: 1,
      },
    ],
  });
};

init();
