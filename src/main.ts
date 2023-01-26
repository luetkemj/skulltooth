import { setupCanvas, View } from "./canvas";
import "./style.css";

declare const __GIT_HASH__: string

const init = async () => {
  await setupCanvas(document.querySelector<HTMLCanvasElement>("#canvas")!);

  const view = new View({
    width: 13,
    height: 3,
    x: 0,
    y: 0,
    halfWidth: false,
    char: " ",
    layers: 4,
    tileSet: "ascii",
    tint: 0xfff77f,
    alpha: 1,
  });

  console.log(view);

  view.updateRow({
    string: "SkulltoothFC",
    layer: 0,
    x: 0,
    y: 0,
    tileSet: "tile",
    tint: 0xffffff,
    alpha: 1,
  });

  view.updateRow({
    string: " Skulltooth",
    layer: 1,
    x: 0,
    y: 0,
    tileSet: "ascii",
    tint: 0xff0077,
    alpha: 1,
  });

  view.updateRow({
    string: "Force Crusher",
    layer: 0,
    x: 0,
    y: 1,
    tileSet: "tile",
    tint: 0xff0077,
    alpha: 1,
  });

  view.updateRow({
    string: "Force Crusher",
    layer: 1,
    x: 0,
    y: 1,
    tileSet: "ascii",
    tint: 0xffffff,
    alpha: 1,
  });

  view.updateCell({
    0: { char: "?", tint: 0x0e0e0e, alpha: 1, tileSet: "tile", x: 0, y: 0 },
    1: { char: "?", tint: 0xc0ffee, alpha: 1, tileSet: "ascii", x: 0, y: 0 },
    2: { char: "!", tint: 0xc0ffee, alpha: 1, tileSet: "ascii", x: 0, y: 0 },
    3: { char: "!", tint: 0xc0ffee, alpha: 0.5, tileSet: "tile", x: 0, y: 0 },
  });

  console.log(view);
 
  // add an initial string or template so we don't have to call updateRow right away.
  const viewGitHash = new View({
    width: 13,
    height: 1,
    x: 0,
    y: 43,
    halfWidth: true,
    char: " ",
    layers: 1,
    tileSet: "text",
    tint: 0xfff77f,
    alpha: 1,
  })
  
  viewGitHash.updateRow({
    string: `TAG: ${__GIT_HASH__}`,
    layer: 0,
    x: 0,
    y: 0,
    tileSet: "text",
    tint: 0xffffff,
    alpha: 1,
  });
};

init();
