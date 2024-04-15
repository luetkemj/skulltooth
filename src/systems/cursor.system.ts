import { getEntity } from "../engine";
import { toPosId } from "../lib/grid";
import { type State, getState, setState, GameState } from "../main";

export const cursorSystem = () => {
  // get cursor position
  const cursorPos = getState().cursor[1];
  const cursorPosId = toPosId(cursorPos);
  const eAP = getState().eAP[cursorPosId];

  // if inspecting
  if (getState().gameState === GameState.INSPECT) {
    eAP.forEach((eId: string) => {
      const entity = getEntity(eId);

      if (entity?.components.isInFov) {
        setState((state: State) => {
          state.senses.see = `You see a ${entity.components.name} here.`;
        });
        return;
      }

      if (entity?.components.isRevealed) {
        setState((state: State) => {
          state.senses.see = `You recall seing a ${entity.components.name} here.`;
        });
        return;
      }

      setState((state: State) => {
        state.senses.see = `You see nothing.`;
      });
    });
  }
};
