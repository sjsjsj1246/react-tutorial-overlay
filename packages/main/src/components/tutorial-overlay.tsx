import React, { useEffect, useRef, useState } from 'react';
import type { ElementStyle, Options, Step } from '../core/types';
import { useTutorialStore } from '../core/store';
import { setup, styled } from 'goober';
import { Content } from './content';
import { tutorial } from '../core/tutorial';
import {
  DEFAULT_HIGHLIGHT_BORDER_COLOR,
  DEFAULT_HIGHLIGHT_PADDING,
  DEFAULT_OVERLAY_COLOR,
  DEFAULT_Z_INDEX,
  HIGHLIGHT_Z_INDEX_OFFSET,
  getBaseZIndex,
  getHighlightBorderColor,
  getHighlightBorderRadius,
  getInfoBoxHeight,
  getInfoBoxMargin,
} from '../core/options';

setup(React.createElement);

const MIN_VIEWPORT_OFFSET = 10;
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(', ');

interface TutorialOverlayProps {
  options?: Options;
}

export const TutorialOverlay = React.memo(({}: TutorialOverlayProps) => {
  const {
    index,
    open,
    tutorial: { steps, options },
  } = useTutorialStore();
  const [rectStyles, setRectStyles] = useState<ElementStyle[]>([]);
  const currentElements = useRef<{ id: string; element: HTMLElement; initialColor: string }[]>([]);
  const infoBoxElement = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(open);
  const timeout = useRef<number | undefined>();
  const baseZIndex = getBaseZIndex(options);

  function shouldIgnoreKeyboardEvent(): boolean {
    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLElement)) {
      return false;
    }

    const tagName = activeElement.tagName;
    return (
      activeElement.isContentEditable ||
      tagName === 'INPUT' ||
      tagName === 'TEXTAREA' ||
      tagName === 'SELECT'
    );
  }

  function resetHighlightedElements(): void {
    currentElements.current.forEach((item) => {
      item.element.classList.remove('foreground');
    });
    currentElements.current = [];
  }

  function getHighlightPadding(): number {
    return Math.max(0, options?.highLightPadding ?? DEFAULT_HIGHLIGHT_PADDING);
  }

  function clamp(value: number, min: number, max: number): number {
    if (max < min) {
      return min;
    }

    return Math.min(Math.max(value, min), max);
  }

  function setHighlightedElementPositions() {
    const stepConfig = steps[index];
    const elementIds = stepConfig?.targetIds;
    if (!elementIds) {
      return;
    }
    const positions: ElementStyle[] = [];
    const elements: {
      id: string;
      element: HTMLElement;
      initialColor: string;
    }[] = [];

    const alreadyCalculated = elementIds[0] === currentElements.current[0]?.id;
    const highlightPadding = getHighlightPadding();
    let infoBoxAnchor: ElementStyle | null = null;

    if (!alreadyCalculated) {
      resetHighlightedElements();
    }

    elementIds.forEach((id: string) => {
      const element: HTMLElement | null = document.getElementById(id);
      if (!element) {
        console.error(`Highlighted element with id ${id} was not found.`);
        return;
      }

      if (!alreadyCalculated) {
        const initialBgColor = window.getComputedStyle(element).backgroundColor;

        elements.push({
          id: id,
          element: element,
          initialColor: initialBgColor,
        });
        element.classList.add('foreground');
      }

      const selectedElPosition: DOMRect = element.getBoundingClientRect();
      if (selectedElPosition) {
        const position: ElementStyle = {
          id: id,
          left: selectedElPosition.left + window.scrollX - highlightPadding,
          top: selectedElPosition.top + window.scrollY - highlightPadding,
          width: selectedElPosition.width + highlightPadding * 2,
          height: selectedElPosition.height + highlightPadding * 2,
          borderRadius: Math.max(10, highlightPadding + 2),
        };
        positions.push(position);
        if (!infoBoxAnchor) {
          infoBoxAnchor = position;
        }
      }
    });

    if (infoBoxAnchor) {
      calculateInfoBoxPosition(infoBoxAnchor, stepConfig);
    }

    if (currentElements.current.length === 0 || !alreadyCalculated) {
      currentElements.current = elements;
    }

    setRectStyles(positions);
  }

  function calculateInfoBoxPosition(position: ElementStyle, step: Step) {
    const alignment = step.infoBoxAlignment;
    const boxHeight = getInfoBoxHeight(options, step);
    const margin = getInfoBoxMargin(options, step);
    const minLeft = window.scrollX + MIN_VIEWPORT_OFFSET;
    const maxLeft = window.scrollX + window.innerWidth - MIN_VIEWPORT_OFFSET;
    const minTop = window.scrollY + MIN_VIEWPORT_OFFSET;
    const maxTop = window.scrollY + window.innerHeight - MIN_VIEWPORT_OFFSET;

    let newBoxTop = position.top - boxHeight - margin;
    const fallbackBoxTop = position.top + position.height + margin;

    const el = infoBoxElement.current;
    if (el) {
      el.style.height = boxHeight + 'px';

      const boxWidth = el.getBoundingClientRect().width || el.clientWidth;
      let newBoxLeft: number;

      if (alignment === 'left') {
        newBoxLeft = position.left;
      } else if (alignment === 'right') {
        newBoxLeft = position.left + position.width - boxWidth;
      } else {
        newBoxLeft = position.left + position.width / 2;
        const halfOfBoxWidth = boxWidth / 2;
        newBoxLeft = clamp(newBoxLeft, minLeft + halfOfBoxWidth, maxLeft - halfOfBoxWidth);
      }

      if (alignment !== 'center') {
        newBoxLeft = clamp(newBoxLeft, minLeft, maxLeft - boxWidth);
      }

      const maxBoxTop = maxTop - boxHeight;
      if (newBoxTop < minTop) {
        newBoxTop = fallbackBoxTop;
      }
      if (newBoxTop > maxBoxTop) {
        if (position.top - boxHeight - margin >= minTop) {
          newBoxTop = position.top - boxHeight - margin;
        } else {
          newBoxTop = clamp(newBoxTop, minTop, maxBoxTop);
        }
      }

      el.style.top = newBoxTop + 'px';
      el.style.left = newBoxLeft + 'px';
      el.style.transform = alignment === 'center' ? 'translate(-50%)' : '';

      const infoContentEl: HTMLElement | null = el.children[0].lastChild as HTMLElement;

      if (infoContentEl) {
        infoContentEl.style.height = `calc(${boxHeight}px - (3rem + 75px))`;
      }

      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }

  useEffect(() => {
    setHighlightedElementPositions();
  }, [steps, index]);

  useEffect(() => {
    if (open && !wasOpen.current) {
      const activeElement = document.activeElement;

      previouslyFocusedElement.current =
        activeElement instanceof HTMLElement && activeElement !== document.body ? activeElement : null;

      const dialog = infoBoxElement.current;
      if (dialog) {
        const focusTarget = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? dialog;
        focusTarget.focus();
      }
    }

    if (!open && wasOpen.current) {
      const focusTarget = previouslyFocusedElement.current;
      previouslyFocusedElement.current = null;

      if (focusTarget && focusTarget.isConnected) {
        focusTarget.focus();
      }
    }

    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open || options?.keyboardNavigation === false) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (shouldIgnoreKeyboardEvent()) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          tutorial.close();
          break;
        case 'ArrowRight':
          event.preventDefault();
          tutorial.next();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          tutorial.prev();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, options?.keyboardNavigation]);

  useEffect(() => {
    function handleResize() {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setHighlightedElementPositions();
      }, 250);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      resetHighlightedElements();
      window.removeEventListener('resize', handleResize);
    };
  }, [steps, index, options]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (options?.closeOnOverlayClick && event.target === event.currentTarget) {
      tutorial.close();
    }
  };

  return open ? (
    <Wrapper
      data-testid="tutorial-overlay-backdrop"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: options?.overlayColor ?? DEFAULT_OVERLAY_COLOR,
        zIndex: baseZIndex,
      }}
    >
      <Content ref={infoBoxElement} />
      {rectStyles.map((style) => (
        <Hightlight
          aria-hidden="true"
          data-testid={`tutorial-overlay-highlight-${style.id}`}
          key={style.id}
          style={{
            ...style,
            borderColor: getHighlightBorderColor(options, steps[index]),
            borderRadius: getHighlightBorderRadius(options, steps[index], style.borderRadius),
            zIndex: baseZIndex + HIGHLIGHT_Z_INDEX_OFFSET,
          }}
        />
      ))}
    </Wrapper>
  ) : null;
});

const Wrapper = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${DEFAULT_Z_INDEX};
  height: 100vh;
  width: 100vw;
  background-color: ${DEFAULT_OVERLAY_COLOR};
`;

const Hightlight = styled('div')`
  position: absolute;
  z-index: ${DEFAULT_Z_INDEX + HIGHLIGHT_Z_INDEX_OFFSET};
  box-sizing: border-box;
  border: 2px solid ${DEFAULT_HIGHLIGHT_BORDER_COLOR};
  border-radius: 0.625rem;
`;
