import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TutorialOverlay } from '../src/components/tutorial-overlay';
import { tutorial } from '../src/core/tutorial';

function renderOverlay() {
  render(
    <div>
      <div id="first-target">First target</div>
      <div id="second-target">Second target</div>
      <TutorialOverlay />
    </div>
  );
}

describe('Content', () => {
  test('button navigation invokes each step callback once', () => {
    const onNextStep = jest.fn();
    const onPrevStep = jest.fn();

    renderOverlay();

    act(() => {
      tutorial.open({
        steps: [
          { title: 'Step 1', content: 'Step 1 content', targetIds: ['first-target'], onNextStep },
          { title: 'Step 2', content: 'Step 2 content', targetIds: ['second-target'], onPrevStep },
        ],
        options: {},
      });
    });

    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    expect(onNextStep).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Step 2 content')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '이전' }));

    expect(onPrevStep).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Step 1 content')).toBeInTheDocument();
  });

  test('renders content strings as text instead of interpreting html', () => {
    renderOverlay();

    act(() => {
      tutorial.open({
        steps: [
          {
            title: 'HTML content',
            content: '<strong>Literal HTML</strong>',
            targetIds: ['first-target'],
          },
        ],
        options: {},
      });
    });

    expect(screen.getByText('<strong>Literal HTML</strong>')).toBeInTheDocument();
    expect(document.querySelector('strong')).toBeNull();
  });

  test('skip button resolves the tutorial promise with skipped', async () => {
    renderOverlay();
    const onClose = jest.fn();

    let resultPromise;

    act(() => {
      resultPromise = tutorial.open({
        steps: [
          {
            title: 'Closable step',
            content: 'Closable content',
            targetIds: ['first-target'],
          },
        ],
        options: { onClose },
      });
    });

    fireEvent.click(screen.getByRole('button', { name: '건너뛰기' }));

    await expect(resultPromise).resolves.toEqual({ reason: 'skipped' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
