import {
  ActionType,
  State,
  createPendingTutorialResult,
  dispatch,
  getState as getStoreState,
  hasPendingTutorialResult,
} from './store';
import type { Step, Tutorial, TutorialProgressState, TutorialResult } from './types';

const open = (tutorial: Tutorial, otherState?: Omit<State, 'tutorial'>): Promise<TutorialResult> => {
  if (getStoreState().open || hasPendingTutorialResult()) {
    dispatch({ type: ActionType.CLOSE, payload: { reason: 'closed' } });
  }

  const resultPromise = createPendingTutorialResult();
  const requestedIndex = otherState?.index ?? tutorial.startAt ?? 0;

  dispatch({
    type: ActionType.OPEN,
    payload: { tutorial, index: requestedIndex, open: otherState?.open ?? true },
  });

  return resultPromise;
};
const close = () => dispatch({ type: ActionType.CLOSE, payload: { reason: 'closed' } });
const next = () => dispatch({ type: ActionType.NEXT });
const prev = () => dispatch({ type: ActionType.PREV });
const goTo = (index: number) => dispatch({ type: ActionType.GOTO, payload: { index } });
const update = (index: number, step: Step) => dispatch({ type: ActionType.UPDATE, payload: { index, step } });

const getState = (): TutorialProgressState => {
  const state = getStoreState();
  const currentStep = state.open ? state.tutorial.steps[state.index] ?? null : null;

  return {
    open: state.open,
    index: state.index,
    stepCount: state.tutorial.steps.length,
    currentStep: currentStep
      ? {
          ...currentStep,
          targetIds: [...currentStep.targetIds],
        }
      : null,
  };
};

export const skipTutorial = () =>
  dispatch({ type: ActionType.CLOSE, payload: { reason: 'skipped' } });

export const tutorial = {
  open,
  close,
  next,
  prev,
  goTo,
  getState,
  update,
};
