import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { TutorialOverlay } from '../src/components/tutorial-overlay';
import { tutorial } from '../src/core/tutorial';

describe('TutorialOverlay', () => {
  test('stays mounted when a target element cannot be found', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<TutorialOverlay />);

    act(() => {
      tutorial.open({
        steps: [
          {
            title: 'Missing target',
            content: 'Overlay stays open',
            targetIds: ['does-not-exist'],
          },
        ],
        options: {},
      });
    });

    expect(screen.getByText('Missing target')).toBeInTheDocument();
    expect(screen.getByText('Overlay stays open')).toBeInTheDocument();
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalledWith('Highlighted element with id does-not-exist was not found.');
  });
});
