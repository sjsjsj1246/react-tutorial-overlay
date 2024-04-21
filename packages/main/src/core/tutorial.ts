import { ActionType, State, dispatch } from './store';
import type { Step, Tutorial } from './types';

const open = (tutorial: Tutorial, otherState?: Omit<State, 'tutorial'>) =>
  dispatch({
    type: ActionType.OPEN,
    payload: { tutorial, index: otherState?.index ?? 0, open: otherState?.open ?? true },
  });
const close = () => dispatch({ type: ActionType.CLOSE });
const next = () => dispatch({ type: ActionType.NEXT });
const prev = () => dispatch({ type: ActionType.PREV });
const update = (index: number, step: Step) => dispatch({ type: ActionType.UPDATE, payload: { index, step } });

export const tutorial = {
  open,
  close,
  next,
  prev,
  update,
};
