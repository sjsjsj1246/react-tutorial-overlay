import { useEffect, useState } from 'react';
import type { Step, Tutorial, TutorialResult, TutorialResultReason } from './types';

export enum ActionType {
  OPEN,
  CLOSE,
  NEXT,
  PREV,
  GOTO,
  UPDATE,
}

type Action =
  | { type: ActionType.OPEN; payload: State }
  | { type: ActionType.CLOSE; payload: { reason: TutorialResultReason } }
  | { type: ActionType.NEXT }
  | { type: ActionType.PREV }
  | { type: ActionType.GOTO; payload: { index: number } }
  | { type: ActionType.UPDATE; payload: { index: number; step: Step } };

export interface State {
  index: number;
  open: boolean;
  tutorial: Tutorial;
}

const initialState: State = {
  index: 0,
  open: false,
  tutorial: {
    steps: [],
    options: {},
  },
};

let pendingTutorialResolver: ((result: TutorialResult) => void) | null = null;

const clampIndex = (index: number, stepCount: number): number => {
  if (stepCount <= 0 || !Number.isFinite(index)) {
    return 0;
  }

  return Math.min(Math.max(Math.trunc(index), 0), stepCount - 1);
};

function settlePendingTutorial(result: TutorialResult) {
  if (!pendingTutorialResolver) {
    return;
  }

  // Clear the resolver before invoking it so duplicate close paths stay a no-op.
  const resolve = pendingTutorialResolver;
  pendingTutorialResolver = null;
  resolve(result);
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.OPEN:
      return {
        ...action.payload,
        index: clampIndex(action.payload.index, action.payload.tutorial.steps.length),
      };
    case ActionType.CLOSE:
      if (!state.open && !hasPendingTutorialResult()) {
        return initialState;
      }

      settlePendingTutorial({ reason: action.payload.reason });
      state.tutorial.options?.onClose?.();
      return initialState;
    case ActionType.NEXT:
      state.tutorial.steps[state.index]?.onNextStep?.();
      if (state.index === state.tutorial.steps.length - 1) {
        return reducer(state, { type: ActionType.CLOSE, payload: { reason: 'completed' } });
      } else {
        return {
          ...state,
          index: state.index + 1,
        };
      }
    case ActionType.PREV:
      if (state.index > 0) {
        state.tutorial.steps[state.index]?.onPrevStep?.();
        return {
          ...state,
          index: state.index - 1,
        };
      }
      return state;
    case ActionType.GOTO:
      if (!state.open || state.tutorial.steps.length === 0) {
        return state;
      }

      return {
        ...state,
        index: clampIndex(action.payload.index, state.tutorial.steps.length),
      };
    case ActionType.UPDATE:
      return {
        ...state,
        index: action.payload.index,
        tutorial: {
          ...state.tutorial,
          steps: state.tutorial.steps.map((step, index) =>
            index === action.payload.index ? action.payload.step : step
          ),
        },
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { ...initialState };

export const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
};

export const getState = (): State => memoryState;

export const hasPendingTutorialResult = (): boolean => pendingTutorialResolver !== null;

export const createPendingTutorialResult = (): Promise<TutorialResult> =>
  new Promise((resolve) => {
    pendingTutorialResolver = resolve;
  });

export const useTutorialStore = (): State => {
  const [state, setState] = useState<State>(memoryState);
  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return state;
};
