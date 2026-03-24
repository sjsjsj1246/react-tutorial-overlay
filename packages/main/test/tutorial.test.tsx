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
});
