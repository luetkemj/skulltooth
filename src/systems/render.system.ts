import { sortBy } from "lodash";
import { State, getState, setState, GameState } from "../main";
import { getEntity, getQuery } from "../engine";
import { QueryTypes } from "../queries";
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
  const isPlayerQuery = getQuery(QueryTypes.IsPlayer);

  const {
    map: mapView,
    log: logView,
    senses: sensesView,
    legend: legendView,
    inventory: inventoryView,
    overlay: overlayView,
  } = getState().views;

  for (const posId of getState().toRender) {
    const eAP = getState().eAP[posId];
    if (eAP) {
      // sort entities at eap into a stack
      const entities = [];
      for (const eId of eAP) {
        const entity = getEntity(eId);
        if (!entity) return;
        entities.push(entity);
      }

      const sortedEntities = sortBy(entities, "components.layer");

      // only render top item on stack
      const entity = sortedEntities[sortedEntities.length - 1];

      const { char, tint } = entity.components.appearance!;
      const { x, y } = entity.components.position!;
      // if entity has been revealed - render accordingly
      if (entity.components.isRevealed) {
        mapView?.updateCell({
          0: { char, tint: 0x000001, alpha: 0, tileSet: "tile", x, y },
          1: { char, tint, alpha: 0.35, tileSet: "ascii", x, y },
        });
      }

      // if entity is in fov - render accordingly
      if (entity.components.isInFov) {
        mapView?.updateCell({
          0: { char, tint: 0x111111, alpha: 0, tileSet: "tile", x, y },
          1: { char, tint, alpha: 1, tileSet: "ascii", x, y },
        });
      }
    }
  }

  setState((state: State) => (state.toRender = new Set()));

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

  // render inventory
  {
    if (getState().gameState === GameState.INVENTORY) {
      // actually render the inventory
      // get player entity
      const [playerEId] = isPlayerQuery.entities;
      const playerEntity = getEntity(playerEId);
      if (!playerEntity) return;

      const rows: Array<Array<UpdateRow>> = [];
      const itemsInInventory = [...playerEntity.components.inventory].map(
        (eId) => getEntity(eId)
      );

      itemsInInventory.forEach((item) => {
        rows.push([
          {},
          {
            string: `${item?.components.appearance?.char} ${item?.components.name}`,
          },
        ]);
      });

      // console.log(rows);
      overlayView?.show();
      inventoryView?.clearView();
      inventoryView?.updateRows(rows);
      inventoryView?.show();
    } else {
      overlayView?.hide();
      inventoryView?.hide();
    }
  }
};
