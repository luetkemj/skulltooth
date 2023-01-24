import { setupCanvas, View } from "./canvas";
import "./style.css";

const init = async () => {
  await setupCanvas(document.querySelector<HTMLCanvasElement>("#canvas")!);

  const view = new View({
    width: 12,
    height: 2,
    x: 0,
    y: 0,
    halfWidth: false,
    char: "@",
    layers: 1,
    tileSet: "ascii",
    tint: 0xfff77f,
    alpha: 1, 
  });

  console.log(view)
};

init();
