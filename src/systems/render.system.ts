import { State, getState, setState } from "../main";
import { getEntity, getQuery } from "../engine";
import { QueryTypes } from "../queries";
import { toPos } from "../lib/grid";
import { UpdateRow } from "../lib/canvas";

// this is not doing anything to reduce the cells that need to be rendered.
// if things slow down or we run into other issues we will need to expand onor use the toRender info from state - not really using that yet.

const concatRow = (str: string, length: number): string => {
  let newStr = str;
  if (newStr.length > length) {
    const trimLength = newStr.length - (length - 3);
    newStr = newStr
      .substring(0, newStr.length - trimLength)
      .trim()
      .concat("...");
  }
  return newStr;
};

// create a gradiant across rows
const getAlpha = (index: number) => {
  if (index < 4) {
    return (100 - (5 - index) * 7) / 100;
  }

  return 1;
};

export const renderSystem = () => {
  const inFov = getQuery(QueryTypes.IsInFov);
  const isRevealed = getQuery(QueryTypes.IsRevealed);
  const isPlayer = getQuery(QueryTypes.IsPlayer);

  const {
    map: mapView,
    log: logView,
    senses: sensesView,
    legend: legendView,
  } = getState().views;

  for (const eId of isRevealed.entities) {
    const entity = getEntity(eId);
    if (!entity) return;

    const { char, tint } = entity.components.appearance!;
    const { x, y } = entity.components.position!;

    mapView?.updateCell({
      0: { char, tint: 0x000001, alpha: 1, tileSet: "tile", x, y },
      1: { char, tint, alpha: 0.35, tileSet: "ascii", x, y },
    });
  }

  for (const eId of inFov.entities) {
    const entity = getEntity(eId);
    if (!entity) return;

    const { char, tint } = entity.components.appearance!;
    const { x, y } = entity.components.position!;

    mapView?.updateCell({
      0: { char, tint: 0x111111, alpha: 1, tileSet: "tile", x, y },
      1: { char, tint, alpha: 1, tileSet: "ascii", x, y },
    });
  }

  for (const eId of isPlayer.entities) {
    const entity = getEntity(eId);
    if (!entity) return;

    const { char, tint } = entity.components.appearance!;
    const { x, y } = entity.components.position!;

    mapView?.updateCell({
      1: { char, tint, alpha: 1, tileSet: "ascii", x, y },
    });

    // this is throwaway until I get the map thing done
    // reset last location to original
    getState().toRender.forEach((posId) => {
      const pos = toPos(posId);
      mapView?.updateCell({
        1: {
          char: "",
          tint: 0x000000,
          alpha: 0,
          tileSet: "ascii",
          x: pos.x,
          y: pos.y,
        },
      });
    });

    // // for debugging
    // const hasAppearance = getQuery(QueryTypes.HasAppearance);
    // for (const eId of hasAppearance.entities) {
    //   const entity = getEntity(eId);
    //   if (!entity) return;
    //
    //   const { char, tint } = entity.components.appearance!;
    //   const { x, y } = entity.components.position!;
    //
    //   mapView?.updateCell({
    //     0: { char, tint, alpha: 1, tileSet: "ascii", x, y },
    //   });
    // }
    // end debug section

    setState((state: State) => (state.toRender = new Set()));
  }

  {
    // render log
    const log = getState().log;
    const messages = log.slice(Math.max(log.length - 5, 0));
    const width = logView!.width - 1;

    logView?.updateRows(
      messages.map((message, index) => {
        return [{ string: concatRow(message, width), alpha: getAlpha(index) }];
      })
    );
  }

  {
    // render sensory perception
    const senses = getState().senses;
    const width = sensesView!.width - 1;
    sensesView?.updateRows([
      [{ string: concatRow(senses.feel, width) }],
      [{ string: concatRow(senses.see, width) }],
      [{ string: concatRow(senses.hear, width) }],
      [{ string: concatRow(senses.smell, width) }],
      [{ string: concatRow(senses.taste, width) }],
    ]);
  }

  // render legend
  {
    legendView?.clearView();
    const legend = getState().legend;

    const rows: Array<Array<UpdateRow>> = [];
    legend.forEach((eId) => {
      const entity = getEntity(eId);
      const entityChar = entity?.components.appearance?.char;
      const entityName = entity?.components.name;

      const string = `${entityChar} ${entityName}`;
      rows.push([{ string }]);
    });

    legendView?.updateRows(rows);
  }
};
