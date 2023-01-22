import { setupCanvas, getFontSpriteSheet } from "./canvas";
import "./style.css";

const init = async () => {
    await setupCanvas(document.querySelector<HTMLCanvasElement>("#canvas")!);

    console.log(getFontSpriteSheet());
};

init()
