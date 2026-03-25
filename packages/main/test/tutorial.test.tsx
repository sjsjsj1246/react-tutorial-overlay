import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useTutorialStore } from '../src/core/store';
import { tutorial } from '../src/core/tutorial';
import type { Tutorial } from '../src/core/types';

const twoStepTutorial: Tutorial = {
  steps: [
    { title: 'Step 1', targetIds: ['first-target'] },
    { title: 'Step 2', targetIds: ['second-target'] },
  ],
  options: {},
};

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
