import { Application, Assets, Container, Sprite } from "pixi.js";
import { menloBoldAlphaMap as asciiMap } from "./sprite-maps/menlo-bold.map";
import { menloBoldHalfAlphaMap as fontMap } from "./sprite-maps/menlo-bold-half.map";

let app: Application;

const grid = {
    width: 100,
    height: 44,
};
const cellWidth = window.innerWidth / grid.width;
// const cellHfW = cellWidth / 2;

export async function setupCanvas(element: HTMLCanvasElement) {
    app = new Application({
        view: element,
        width: window.innerWidth,
        height: cellWidth * grid.height,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
        // TODO: allow user resizing
        // resizeTo is a prop that can eventually be used for proper resizing
    });

    await loadSprites();

    const container: Container = new Container();
    const texture = await getFontTexture("@");
    const sprite: Sprite = new Sprite(texture);

    container.addChild(sprite);
    app.stage.addChild(container);
}

const loadSprites = async () => {
    Assets.add("ascii", "/skulltooth/fonts/menlo-bold.json");
    Assets.add("font", "/skulltooth/fonts/menlo-bold-half.json");
    Assets.add("tile", "/skulltooth/tile.png");
};

const getAsciiTexture = async (char: string) => {
    const texture = await Assets.load("ascii");
    return texture.textures[asciiMap[char as keyof typeof asciiMap]];
};

const getFontTexture = async (char: string) => {
    const texture = await Assets.load("font");
    return texture.textures[fontMap[char as keyof typeof fontMap]];
};

const getTileTexture = async (char: string) => {
    const texture = await Assets.load("ascii");
    return texture.textures[asciiMap[char as keyof typeof asciiMap]];
};
