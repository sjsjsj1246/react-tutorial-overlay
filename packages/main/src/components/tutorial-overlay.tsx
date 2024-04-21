import React, { RefObject, useEffect, useRef, useState } from 'react';
import type { ElementStyle, Options } from '../core/types';
import { useTutorialStore } from '../core/store';
import { setup, styled } from 'goober';
import { Content } from './content';

setup(React.createElement);

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
  const timeout = useRef<number | undefined>();

  function resetHighlightedElements(): void {
    currentElements.current.forEach((item) => {
      item.element.classList.remove('foreground');
    });
    currentElements.current = [];
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

    if (!alreadyCalculated) {
      resetHighlightedElements();
    }

    elementIds.forEach((id: string, index: number) => {
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
          left: selectedElPosition.left + window.scrollX - 1,
          top: selectedElPosition.top + window.scrollY - 1,
          width: selectedElPosition.width + 2,
          height: selectedElPosition.height + 2,
        };
        positions.push(position);
        if (index === 0) {
          calculateInfoBoxPosition(position, stepConfig.infoBoxAlignment);
        }
      }
    });
    if (currentElements.current.length === 0 || !alreadyCalculated) {
      currentElements.current = elements;
    }

    setRectStyles(positions);
  }

  function calculateInfoBoxPosition(position: ElementStyle, alignment?: 'center' | 'left' | 'right') {
    const boxHeight = options?.infoBoxHeight ?? 200;
    const margin = options?.infoBoxMargin ?? 30;

    let newBoxTop = position.top - boxHeight - margin;
    if (newBoxTop < 10) {
      newBoxTop = position.top + position.height + margin;
    }

    const el = infoBoxElement.current;
    if (el) {
      let newBoxLeft: number;
      if (alignment === 'left') {
        newBoxLeft = position.left < 10 ? 10 : position.left;
      } else if (alignment === 'right') {
        newBoxLeft = position.left + position.width - el.clientWidth;
      } else {
        newBoxLeft = position.left + position.width / 2;
        const halfOfBoxWidth = el.clientWidth / 2;
        newBoxLeft = newBoxLeft - halfOfBoxWidth < 10 ? 10 + halfOfBoxWidth : newBoxLeft;
      }
      el.style.height = boxHeight + 'px';
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

  return open ? (
    <Wrapper>
      <Content ref={infoBoxElement as RefObject<HTMLInputElement>} />
      {rectStyles.map((style) => (
        <Hightlight key={style.id} style={style} />
      ))}
    </Wrapper>
  ) : null;
});

const Wrapper = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Hightlight = styled('div')`
  position: absolute;
  z-index: 9999;
  border: 2px solid #ff0000;
  border-radius: 0.625rem;
  transform: translate(-1px, -1px);
`;
