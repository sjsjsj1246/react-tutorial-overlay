import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useTutorialStore } from '../src/core/store';
import { tutorial } from '../src/core/tutorial';

function StateProbe() {
  const {
    index,
    tutorial: { steps },
  } = useTutorialStore();

  return <span data-testid="title">{steps[index]?.title ?? 'none'}</span>;
}

describe('store step callbacks', () => {
  test('tutorial.next and tutorial.prev invoke step callbacks once per transition', () => {
    const onNextStep = jest.fn();
    const onPrevStep = jest.fn();

    render(<StateProbe />);

    act(() => {
      tutorial.open({
        steps: [
          { title: 'Step 1', targetIds: ['first-target'], onNextStep },
          { title: 'Step 2', targetIds: ['second-target'], onPrevStep },
        ],
        options: {},
      });
    });

    act(() => {
      tutorial.next();
    });

    expect(onNextStep).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('title')).toHaveTextContent('Step 2');

    act(() => {
      tutorial.prev();
    });

    expect(onPrevStep).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('title')).toHaveTextContent('Step 1');
  });
});
