import { useEffect, useState } from 'react';
import type { Step, Tutorial } from './types';

export enum ActionType {
  OPEN,
  CLOSE,
  NEXT,
  PREV,
  UPDATE,
}

type Action =
  | { type: ActionType.OPEN; payload: State }
  | { type: ActionType.CLOSE }
  | { type: ActionType.NEXT }
  | { type: ActionType.PREV }
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

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.OPEN:
      return action.payload;
    case ActionType.CLOSE:
      state.tutorial.options?.onClose?.();
      return initialState;
    case ActionType.NEXT:
      state.tutorial.steps[state.index]?.onNextStep?.();
      if (state.index === state.tutorial.steps.length - 1) {
        return reducer(state, { type: ActionType.CLOSE });
      } else {
        return {
          ...state,
          index: state.index + 1,
        };
      }
    case ActionType.PREV:
      state.tutorial.steps[state.index]?.onPrevStep?.();
      if (state.index > 0) {
        return {
          ...state,
          index: state.index - 1,
        };
      }
      return state;
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
