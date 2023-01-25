import _ from "lodash";
import {
  Application,
  Assets,
  Container,
  Sprite,
  Spritesheet,
  Texture,
} from "pixi.js";
import { menloBoldAlphaMap as asciiMap } from "./sprite-maps/menlo-bold.map";
import { menloBoldHalfAlphaMap as fontMap } from "./sprite-maps/menlo-bold-half.map";

let app: Application;

const grid = {
  width: 100,
  height: 44,
};

const cellWidth = window.innerWidth / grid.width;
// const cellHfW = cellWidth / 2;

type Textures = {
  ascii: Spritesheet;
  text: Spritesheet;
  tile: Texture;
};
const textures = {} as Textures;

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
}

export const loadSprites = async (): Promise<Textures> => {
  textures.ascii = await Assets.load("/skulltooth/fonts/menlo-bold.json");
  textures.text = await Assets.load("/skulltooth/fonts/menlo-bold-half.json");
  textures.tile = await Assets.load("/skulltooth/tile.png");

  return textures
};

const getAsciiTexture = (char: string): Texture => {
  return textures.ascii.textures[asciiMap[char as keyof typeof asciiMap]];
};

const getFontTexture = (char: string): Texture => {
  return textures.text.textures[fontMap[char as keyof typeof fontMap]];
};

const getTileTexture = (): Texture => {
  return textures.tile;
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

interface CreateSpriteOptions {
  char: string;
  width: number;
  height: number;
  halfWidth: Boolean;
  layer: number;
  x: number;
  y: number;
  tileSet: string;
  tint: number;
  alpha: number;
}

interface UpdateSprite {
  char?: string;
  layer: number;
  x: number;
  y: number;
  tileSet: string;
  tint: number;
  alpha: number;
}

interface UpdateRow {
  string: string;
  layer: number;
  x: number;
  y: number;
  tileSet: string;
  tint: number;
  alpha: number;
}

type Layer = {
  char: string;
  tint: number;
  alpha: number;
  tileSet: string;
  x: number;
  y: number;
};

type LayerMap = { [key: string]: Layer };

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
        _.times(this.width, async (x) => {
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

  _getTexture = (opts: GetTextureOptions): Texture => {
    const { tileSet, char } = opts;
    if (tileSet === "ascii") return getAsciiTexture(char);
    if (tileSet === "text") return getFontTexture(char);
    return getTileTexture();
  };

  _createSprite = (opts: CreateSpriteOptions) => {
    const {
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
    } = opts;

    const texture = this._getTexture({ tileSet, char });
    let sprite = new Sprite(texture);
    sprite.width = halfWidth ? width / 2 : width;
    sprite.height = height;
    sprite.x = halfWidth ? x * (width / 2) : x * width;
    sprite.y = y * height;
    sprite.tint = tint;
    sprite.alpha = alpha;

    this.sprites[layer][y][x] = sprite;
    this.layers[layer].addChild(sprite);
  };

  updateCell = (layerMap: LayerMap) => {
    Object.keys(layerMap).forEach((layer) => {
      const { char, tint, alpha, tileSet, x, y } = layerMap[layer];

      this.updateSprite({
        char,
        tint,
        alpha,
        tileSet,
        x,
        y,
        layer: parseInt(layer),
      });
    });
  };

  updateSprite = async (opts: UpdateSprite) => {
    const { char = "", layer, x, y, tileSet = "text", tint, alpha } = opts;
    const sprite = this.sprites[layer][y][x];
    sprite.texture = this._getTexture({ tileSet, char });
    if (tint) sprite.tint = tint;
    if (alpha) sprite.alpha = alpha;
  };

  updateRow = (opts: UpdateRow) => {
    const { string, layer, x, y, tileSet, tint, alpha } = opts;
    if (string) {
      [...string].forEach((char, index) =>
        this.updateSprite({
          char,
          layer,
          x: x + index,
          y,
          tileSet,
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
          tint,
          alpha,
        });
      });

    return this;
  };
}
