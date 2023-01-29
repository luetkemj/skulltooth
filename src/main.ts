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
    }).updateRows([
        [{}, { string: " skulltooth" }],
        [{ tint: 0xff0077 }, { string: "forcecrusher", tint: 0xffffff }],
    ]);

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
};

init();
