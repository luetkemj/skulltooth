import { Application, Assets, Container, Sprite, Spritesheet } from "pixi.js";
import { menloBoldAlphaMap } from "./sprite-maps/menlo-bold.map";

let app: Application;
let fontSpriteSheet: Spritesheet;

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
        // resizeTo
    });

    fontSpriteSheet = await Assets.load("/fonts/menlo-bold.json");

    const container: Container = new Container();
    const sprite: Sprite = new Sprite(
        fontSpriteSheet.textures[menloBoldAlphaMap["@"]]
    );

    container.addChild(sprite);

    app.stage.addChild(container);

    console.log(fontSpriteSheet);
    console.log(app);
    console.log(menloBoldAlphaMap)
    // let counter = 0
    // const setCounter = (count: number) => {
    //   counter = count
    //   element.innerHTML = `count is ${counter}`
    // }
    // element.addEventListener('click', () => setCounter(counter + 1))
    // setCounter(0)
}

export const getFontSpriteSheet = () => fontSpriteSheet;
