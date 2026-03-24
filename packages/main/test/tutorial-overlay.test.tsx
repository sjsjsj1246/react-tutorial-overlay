import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TutorialOverlay } from '../src/components/tutorial-overlay';
import { tutorial } from '../src/core/tutorial';
import type { Options } from '../src/core/types';

function renderOverlay() {
  render(
    <div>
      <input aria-label="Page input" />
      <div id="first-target">First target</div>
      <div id="second-target">Second target</div>
      <TutorialOverlay />
    </div>
  );
}

function openTutorial(options: Options = {}) {
  act(() => {
    tutorial.open({
      steps: [
        {
          title: 'Step 1',
          content: 'Step 1 content',
          targetIds: ['first-target'],
        },
        {
          title: 'Step 2',
          content: 'Step 2 content',
          targetIds: ['second-target'],
        },
      ],
      options,
    });
  });
}

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

  test('supports keyboard navigation by default', () => {
    const onClose = jest.fn();

    renderOverlay();
    openTutorial({ onClose });

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(screen.getByText('Step 2 content')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    expect(screen.getByText('Step 1 content')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Step 1 content')).not.toBeInTheDocument();
  });

  test('keeps first step on ArrowLeft and closes after ArrowRight on the last step', () => {
    const onClose = jest.fn();

    renderOverlay();
    openTutorial({ onClose });

    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    expect(screen.getByText('Step 1 content')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Step 2 content')).not.toBeInTheDocument();
  });

  test('does not handle keyboard shortcuts when keyboardNavigation is disabled', () => {
    const onClose = jest.fn();

    renderOverlay();
    openTutorial({ keyboardNavigation: false, onClose });

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.getByText('Step 1 content')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  test('ignores keyboard shortcuts while a text input has focus', () => {
    const onClose = jest.fn();

    renderOverlay();
    openTutorial({ onClose });

    const input = screen.getByLabelText('Page input');
    input.focus();

    fireEvent.keyDown(input, { key: 'ArrowRight' });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.getByText('Step 1 content')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  test('closes on backdrop click only when closeOnOverlayClick is enabled', () => {
    const onClose = jest.fn();

    renderOverlay();
    openTutorial({ closeOnOverlayClick: true, onClose });

    fireEvent.click(screen.getByTestId('tutorial-overlay-highlight-first-target'));

    expect(screen.getByText('Step 1 content')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Step 1 content'));

    expect(screen.getByText('Step 1 content')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('tutorial-overlay-backdrop'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Step 1 content')).not.toBeInTheDocument();
  });

  test('does not close on backdrop click by default', () => {
    const onClose = jest.fn();

    renderOverlay();
    openTutorial({ onClose });

    fireEvent.click(screen.getByTestId('tutorial-overlay-backdrop'));

    expect(screen.getByText('Step 1 content')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });
});
