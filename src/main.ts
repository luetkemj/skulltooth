import { setupCanvas } from "./canvas";
import "./style.css";

const init = async () => {
    await setupCanvas(document.querySelector<HTMLCanvasElement>("#canvas")!);
};

init();
