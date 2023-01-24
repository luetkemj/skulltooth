import _ from "lodash";
import { Application, Assets, Container, Sprite, Texture } from "pixi.js";
import { menloBoldAlphaMap as asciiMap } from "./sprite-maps/menlo-bold.map";
import { menloBoldHalfAlphaMap as fontMap } from "./sprite-maps/menlo-bold-half.map";

let app: Application;

const grid = {
  width: 100,
  height: 44,
};

const cellWidth = window.innerWidth / grid.width;
// const cellHfW = cellWidth / 2;

export async function setupCanvas(element: HTMLCanvasElement): Promise<void> {
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

const loadSprites = async (): Promise<void> => {
  Assets.add("ascii", "/skulltooth/fonts/menlo-bold.json");
  Assets.add("font", "/skulltooth/fonts/menlo-bold-half.json");
  Assets.add("tile", "/skulltooth/tile.png");
};

const getAsciiTexture = async (char: string): Promise<Texture> => {
  const texture = await Assets.load("ascii");
  return texture.textures[asciiMap[char as keyof typeof asciiMap]];
};

const getFontTexture = async (char: string): Promise<Texture> => {
  const texture = await Assets.load("font");
  return texture.textures[fontMap[char as keyof typeof fontMap]];
};

const getTileTexture = async (): Promise<Texture> => {
  const texture = await Assets.load("tile");
  return texture;
};

interface ViewOptions {
  width: number;
  height: number;
  halfWidth: boolean;
  x: number;
  y: number;
  char: string;
  layers: number;
  tileSet: string;
  tint: number;
  alpha: number;
}

interface GetTextureOptions {
  tileSet: string;
  char: string;
}

// width,
// height,
// halfWidth,
// x = 0,
// y = 0,
// char = "",
// layers = 3,
// tileSet = "asci",
// tint = 0xffffff,
// alpha = 1,
export class View {
  width;
  height;
  layers: Container[] = [];
  sprites: Sprite[][][] = [];

  constructor(options: ViewOptions) {
    this.width = options.width;
    this.height = options.height;

    // create n layers of containers
    _.times(options.layers, () => this.layers.push(new Container()));

    this.layers.forEach((layer) => {
      const posX = options.halfWidth
        ? options.x * (cellWidth / 2)
        : options.x * cellWidth;
      const posY = options.y * cellWidth;

      layer.x = posX;
      layer.y = posY;
      layer.interactiveChildren = false;

      app.stage.addChild(layer);
    });

    // create three layers of arrays of arrays to store sprites
    _.times(options.layers, () =>
      this.sprites.push(
        Array.from(Array(this.height), () => Array.from(Array(this.width)))
      )
    );

    // create sprites and store them
    _.times(options.layers, (layer) => {
      _.times(this.height, (y) => {
        _.times(this.width, (x) => {
          this._createSprite({
            char: options.char,
            width: cellWidth,
            height: cellWidth,
            halfWidth: options.halfWidth,
            layer,
            x,
            y,
            tileSet: options.tileSet,
            tint: options.tint,
            alpha: options.alpha,
          });
        });
      });
    });

    return this;
  }

  _getTexture = async (opts: GetTextureOptions): Promise<Texture> => {
    const { tileSet, char } = opts;
    if (tileSet === "asci") return getAsciiTexture(char);
    if (tileSet === "text") return getFontTexture(char);
    return getTileTexture();
  };

  _createSprite = ({
    char,
    width,
    height,
    halfWidth,
    layer,
    x,
    y,
    tileSet,
    tint = 0xffffff,
    alpha = 1,
  }) => {
    let sprite = new PIXI.Sprite(this._getTexture({ tileSet, char }));
    sprite.width = halfWidth ? width / 2 : width;
    sprite.height = height;
    sprite.x = halfWidth ? x * (width / 2) : x * width;
    sprite.y = y * height;
    sprite.tint = tint;
    sprite.alpha = alpha;

    this.sprites[layer][y][x] = sprite;
    this.layers[layer].addChild(sprite);
  };

  updateCell = (layerMap) => {
    Object.keys(layerMap).forEach((layer) => {
      const { char, tint, alpha, tileSet, x, y } = layerMap[layer];

      this.updateSprite({
        char,
        tint,
        alpha,
        tileSet,
        x,
        y,
        layer,
      });
    });
  };

  updateSprite = ({
    char = "",
    layer,
    x,
    y,
    tileSet = "text",
    tint,
    alpha,
  }) => {
    const sprite = this.sprites[layer][y][x];
    sprite.texture = this._getTexture({ tileSet, char });
    if (tint) sprite.tint = tint;
    if (alpha) sprite.alpha = alpha;
  };

  updateRow = ({ string, layer, x, y, tileSet, halfWidth, tint, alpha }) => {
    if (string) {
      [...string].forEach((char, index) =>
        this.updateSprite({
          char,
          layer,
          x: x + index,
          y,
          tileSet,
          halfWidth,
          tint,
          alpha,
        })
      );
    }

    if (tileSet === "tile")
      _.times(this.width, (index) => {
        this.updateSprite({
          layer,
          x: x + index,
          y,
          tileSet,
          halfWidth,
          tint,
          alpha,
        });
      });

    return this;
  };
}
