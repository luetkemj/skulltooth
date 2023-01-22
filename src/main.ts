import { setupCanvas, getFontSpriteSheet } from "./canvas";
import "./style.css";

document.querySelector<HTMLDivElement>(
    "#app"
)!.innerHTML = `<canvas id="canvas"/>`;

await setupCanvas(document.querySelector<HTMLCanvasElement>("#canvas")!);

console.log(getFontSpriteSheet())
