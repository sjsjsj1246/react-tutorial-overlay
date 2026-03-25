import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useTutorialStore } from '../src/core/store';
import { tutorial } from '../src/core/tutorial';
import type { Step, Tutorial } from '../src/core/types';

const twoStepTutorial: Tutorial = {
  steps: [
    { title: 'Step 1', targetIds: ['first-target'] },
    { title: 'Step 2', targetIds: ['second-target'] },
  ],
  options: {},
};

type TutorialController = typeof tutorial & {
  goTo: (index: number) => void;
  getState: () => {
    open: boolean;
    index: number;
    stepCount: number;
    currentStep: Step | null;
  };
};

const progressTutorial = tutorial as TutorialController;

function StateProbe() {
  const {
    index,
    open,
    tutorial: { steps },
  } = useTutorialStore();

  return (
    <div>
      <span data-testid="open">{String(open)}</span>
      <span data-testid="index">{String(index)}</span>
      <span data-testid="title">{steps[index]?.title ?? 'none'}</span>
    </div>
  );
}

describe('tutorial core API', () => {
  test('tutorial.open opens the tutorial and tutorial.next advances the current step', () => {
    render(<StateProbe />);

    expect(screen.getByTestId('open')).toHaveTextContent('false');
    expect(screen.getByTestId('index')).toHaveTextContent('0');

    act(() => {
      tutorial.open(twoStepTutorial);
    });

    expect(screen.getByTestId('open')).toHaveTextContent('true');
    expect(screen.getByTestId('index')).toHaveTextContent('0');
    expect(screen.getByTestId('title')).toHaveTextContent('Step 1');

    act(() => {
      tutorial.next();
    });

    expect(screen.getByTestId('open')).toHaveTextContent('true');
    expect(screen.getByTestId('index')).toHaveTextContent('1');
    expect(screen.getByTestId('title')).toHaveTextContent('Step 2');
  });

  test('tutorial.open supports startAt and clamps it to the available step range', () => {
    render(<StateProbe />);

    act(() => {
      tutorial.open({
        ...twoStepTutorial,
        startAt: 99,
      } as Tutorial & { startAt: number });
    });

    expect(screen.getByTestId('open')).toHaveTextContent('true');
    expect(screen.getByTestId('index')).toHaveTextContent('1');
    expect(screen.getByTestId('title')).toHaveTextContent('Step 2');
  });

  test('tutorial.next closes the tutorial on the last step', () => {
    render(<StateProbe />);

    act(() => {
      tutorial.open({
        steps: [{ title: 'Only step', targetIds: ['only-target'] }],
        options: {},
      });
    });

    expect(screen.getByTestId('open')).toHaveTextContent('true');
    expect(screen.getByTestId('title')).toHaveTextContent('Only step');

    act(() => {
      tutorial.next();
    });

    expect(screen.getByTestId('open')).toHaveTextContent('false');
    expect(screen.getByTestId('index')).toHaveTextContent('0');
    expect(screen.getByTestId('title')).toHaveTextContent('none');
  });

  test('tutorial.close closes an open tutorial', () => {
    render(<StateProbe />);

    act(() => {
      tutorial.open(twoStepTutorial);
    });

    expect(screen.getByTestId('open')).toHaveTextContent('true');

    act(() => {
      tutorial.close();
    });

    expect(screen.getByTestId('open')).toHaveTextContent('false');
    expect(screen.getByTestId('index')).toHaveTextContent('0');
    expect(screen.getByTestId('title')).toHaveTextContent('none');
  });

  test('tutorial.goTo moves to a specific step and clamps invalid indexes', () => {
    render(<StateProbe />);

    act(() => {
      tutorial.open(twoStepTutorial);
    });

    act(() => {
      progressTutorial.goTo(1);
    });

    expect(screen.getByTestId('index')).toHaveTextContent('1');
    expect(screen.getByTestId('title')).toHaveTextContent('Step 2');

    act(() => {
      progressTutorial.goTo(-3);
    });

    expect(screen.getByTestId('index')).toHaveTextContent('0');
    expect(screen.getByTestId('title')).toHaveTextContent('Step 1');

    act(() => {
      progressTutorial.goTo(10);
    });

    expect(screen.getByTestId('index')).toHaveTextContent('1');
    expect(screen.getByTestId('title')).toHaveTextContent('Step 2');
  });

  test('tutorial.goTo is a no-op while the tutorial is closed', () => {
    render(<StateProbe />);

    act(() => {
      progressTutorial.goTo(1);
    });

    expect(screen.getByTestId('open')).toHaveTextContent('false');
    expect(screen.getByTestId('index')).toHaveTextContent('0');
    expect(screen.getByTestId('title')).toHaveTextContent('none');
  });

  test('tutorial.getState returns a public snapshot for external progress control', () => {
    render(<StateProbe />);

    expect(progressTutorial.getState()).toEqual({
      open: false,
      index: 0,
      stepCount: 0,
      currentStep: null,
    });

    act(() => {
      tutorial.open({
        ...twoStepTutorial,
        startAt: 1,
      } as Tutorial & { startAt: number });
    });

    expect(progressTutorial.getState()).toEqual({
      open: true,
      index: 1,
      stepCount: 2,
      currentStep: { title: 'Step 2', targetIds: ['second-target'] },
    });
  });

  test('tutorial.open resolves with completed when the last step finishes', async () => {
    render(<StateProbe />);
    const onClose = jest.fn();

    let resultPromise;

    act(() => {
      resultPromise = tutorial.open({
        steps: [{ title: 'Only step', targetIds: ['only-target'] }],
        options: { onClose },
      });
    });

    act(() => {
      tutorial.next();
    });

    await expect(resultPromise).resolves.toEqual({ reason: 'completed' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('tutorial.goTo only changes the active step and keeps the open promise contract intact', async () => {
    render(<StateProbe />);

    let resultPromise;

    act(() => {
      resultPromise = tutorial.open(twoStepTutorial);
    });

    act(() => {
      progressTutorial.goTo(1);
    });

    act(() => {
      tutorial.next();
    });

    await expect(resultPromise).resolves.toEqual({ reason: 'completed' });
  });

  test('tutorial.close resolves the active tutorial with closed', async () => {
    render(<StateProbe />);
    const onClose = jest.fn();

    let resultPromise;

    act(() => {
      resultPromise = tutorial.open({
        ...twoStepTutorial,
        options: { onClose },
      });
    });

    act(() => {
      tutorial.close();
    });

    await expect(resultPromise).resolves.toEqual({ reason: 'closed' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('opening a new tutorial resolves the previous pending promise with replaced', async () => {
    render(<StateProbe />);

    let firstPromise;
    let secondPromise;

    act(() => {
      firstPromise = tutorial.open(twoStepTutorial);
    });

    act(() => {
      secondPromise = tutorial.open({
        steps: [{ title: 'Replacement step', targetIds: ['replacement-target'] }],
        options: {},
      });
    });

    act(() => {
      tutorial.close();
    });

    await expect(firstPromise).resolves.toEqual({ reason: 'replaced' });
    await expect(secondPromise).resolves.toEqual({ reason: 'closed' });
  });

  test('repeated close calls after the tutorial settles do not re-run onClose or change the result', async () => {
    render(<StateProbe />);
    const onClose = jest.fn();

    let resultPromise;

    act(() => {
      resultPromise = tutorial.open({
        steps: [{ title: 'Only step', targetIds: ['only-target'] }],
        options: { onClose },
      });
    });

    act(() => {
      tutorial.next();
      tutorial.close();
      tutorial.close();
    });

    await expect(resultPromise).resolves.toEqual({ reason: 'completed' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
