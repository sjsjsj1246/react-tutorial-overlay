import {
  ActionType,
  State,
  createPendingTutorialResult,
  dispatch,
  getState,
  hasPendingTutorialResult,
} from './store';
import type { Step, Tutorial, TutorialResult } from './types';

const open = (tutorial: Tutorial, otherState?: Omit<State, 'tutorial'>): Promise<TutorialResult> => {
  if (getState().open || hasPendingTutorialResult()) {
    dispatch({ type: ActionType.CLOSE, payload: { reason: 'replaced' } });
  }

  const resultPromise = createPendingTutorialResult();

  dispatch({
    type: ActionType.OPEN,
    payload: { tutorial, index: otherState?.index ?? 0, open: otherState?.open ?? true },
  });

  return resultPromise;
};
const close = () => dispatch({ type: ActionType.CLOSE, payload: { reason: 'closed' } });
const next = () => dispatch({ type: ActionType.NEXT });
const prev = () => dispatch({ type: ActionType.PREV });
const update = (index: number, step: Step) => dispatch({ type: ActionType.UPDATE, payload: { index, step } });

export const skipTutorial = () =>
  dispatch({ type: ActionType.CLOSE, payload: { reason: 'skipped' } });

export const tutorial = {
  open,
  close,
  next,
  prev,
  update,
};
