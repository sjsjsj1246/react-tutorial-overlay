import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TutorialOverlay } from '../src/components/tutorial-overlay';
import { tutorial } from '../src/core/tutorial';
import type { Options } from '../src/core/types';

const DEFAULT_HIGHLIGHT_PADDING = 8;

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

function createDomRect({ left, top, width, height }: { left: number; top: number; width: number; height: number }): DOMRect {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => '',
  } as DOMRect;
}

function mockTargetRect(id: string, rect: { left: number; top: number; width: number; height: number }) {
  const element = document.getElementById(id) as HTMLElement;
  element.getBoundingClientRect = jest.fn(() => createDomRect(rect));
}

function getInfoBoxElement(): HTMLDivElement {
  return screen.getByText('Step 1').closest('div')?.parentElement?.parentElement as HTMLDivElement;
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

  test('applies the default highlight padding to the calculated rect', () => {
    renderOverlay();
    mockTargetRect('first-target', { left: 100, top: 80, width: 120, height: 40 });

    openTutorial();

    expect(screen.getByTestId('tutorial-overlay-highlight-first-target')).toHaveStyle({
      left: `${100 - DEFAULT_HIGHLIGHT_PADDING}px`,
      top: `${80 - DEFAULT_HIGHLIGHT_PADDING}px`,
      width: `${120 + DEFAULT_HIGHLIGHT_PADDING * 2}px`,
      height: `${40 + DEFAULT_HIGHLIGHT_PADDING * 2}px`,
    });
  });

  test('applies a custom highlight padding to the calculated rect', () => {
    renderOverlay();
    mockTargetRect('first-target', { left: 200, top: 160, width: 80, height: 32 });

    openTutorial({ highLightPadding: 16 });

    expect(screen.getByTestId('tutorial-overlay-highlight-first-target')).toHaveStyle({
      left: '184px',
      top: '144px',
      width: '112px',
      height: '64px',
    });
  });

  test('keeps the info box inside the viewport when padding expands the target rect', () => {
    jest.useFakeTimers();
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 600,
    });

    renderOverlay();
    mockTargetRect('first-target', { left: 760, top: 100, width: 40, height: 40 });

    act(() => {
      tutorial.open({
        steps: [
          {
            title: 'Step 1',
            content: 'Step 1 content',
            targetIds: ['first-target'],
            infoBoxAlignment: 'right',
          },
        ],
        options: {
          highLightPadding: 8,
        },
      });
    });

    const infoBox = getInfoBoxElement();
    Object.defineProperty(infoBox, 'clientWidth', {
      configurable: true,
      value: 320,
    });
    Object.defineProperty(infoBox, 'clientHeight', {
      configurable: true,
      value: 200,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(300);
    });

    expect(infoBox.style.left).toBe('470px');

    jest.useRealTimers();
  });

  test('clamps the info box vertically when neither side has enough space', () => {
    jest.useFakeTimers();
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 600,
    });

    renderOverlay();
    mockTargetRect('first-target', { left: 120, top: 100, width: 80, height: 40 });

    openTutorial({ infoBoxHeight: 520 });

    const infoBox = getInfoBoxElement();
    Object.defineProperty(infoBox, 'clientWidth', {
      configurable: true,
      value: 320,
    });
    Object.defineProperty(infoBox, 'clientHeight', {
      configurable: true,
      value: 520,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(300);
    });

    expect(infoBox.style.top).toBe('70px');

    jest.useRealTimers();
  });
});
