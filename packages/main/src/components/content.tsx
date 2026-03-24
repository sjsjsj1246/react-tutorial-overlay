import React, { useId } from 'react';
import { useTutorialStore } from '../core/store';
import { skipTutorial, tutorial } from '../core/tutorial';
import { styled } from 'goober';
import { DEFAULT_INFO_BOX_WIDTH, INFO_BOX_Z_INDEX_OFFSET, getBaseZIndex, getLabels } from '../core/options';

export const Content = React.forwardRef<HTMLDivElement>((_, ref) => {
  const {
    index,
    tutorial: { steps, options },
  } = useTutorialStore();
  const currentStep = steps[index];
  const titleId = useId();
  const contentId = useId();
  const labels = getLabels(options);

  const handlePrev = () => {
    tutorial.prev();
  };

  const handleNext = () => {
    tutorial.next();
  };

  const handleClose = () => {
    skipTutorial();
  };

  return (
    <Wrapper
      ref={ref}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={currentStep.content ? contentId : undefined}
      tabIndex={-1}
      style={{
        width: options?.infoBoxWidth ?? DEFAULT_INFO_BOX_WIDTH,
        zIndex: getBaseZIndex(options) + INFO_BOX_Z_INDEX_OFFSET,
      }}
    >
      <Heander>
        <InfoTitle>
          <Title id={titleId}>{currentStep.title}</Title>
          <button onClick={handleClose}>{labels.skip}</button>
        </InfoTitle>
        <InfoContent id={contentId}>{currentStep.content ?? ''}</InfoContent>
      </Heander>
      <Footer className="flex items-center justify-between">
        <InfoSteps className="text-[.75rem] font-medium text-sub-2.5">
          <span>{`${index + 1} / ${steps.length}`}</span>
        </InfoSteps>
        <ButtonWrapper className="flex gap-[.625rem]">
          {index !== 0 && <button onClick={handlePrev}>{labels.prev}</button>}
          <button onClick={handleNext}>{index === steps.length - 1 ? labels.done : labels.next}</button>
        </ButtonWrapper>
      </Footer>
    </Wrapper>
  );
});
Content.displayName = 'Content';

const Wrapper = styled('div', React.forwardRef)`
  position: absolute;
  top: 6.25rem;
  z-index: 10001;
  width: 20rem;
  min-height: 7.5rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.625rem;
  background-color: white;
  padding: 1rem;
  box-shadow: 5px 5px 15px 0px rgba(142, 142, 142, 0.3);
`;

const Heander = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled('h2')`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0;
`;

const InfoTitle = styled('div')`
  display: flex;
  align-items: center;

  button {
    font-size: 0.75rem;
    font-weight: 500;
    color: #1f1f1f;
    margin-left: auto;
    text-decoration: underline;
    text-underline-offset: 0.1rem;
  }
`;

const InfoContent = styled('div')`
  margin-top: 1rem;
  flex: 1;
  overflow-y: scroll;
`;

const Footer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoSteps = styled('div')`
  display: flex;
  font-size: 0.75rem;
  font-weight: 500;
  color: #1f1f1f;
`;

const ButtonWrapper = styled('div')`
  display: flex;
  gap: 0.625rem;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.5rem;
    padding: 0 0.375rem;
    border-radius: 0.3125rem;
    border: 0.0625rem solid #1f1f1f;
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f1f1f;
    transition: all 0.3s;

    &:hover {
      background-color: #1f1f1f;
      color: white;
    }

    &:disabled {
      border: 0.0625rem solid #1f1f1f;
      color: #1f1f1f;
    }
  }
`;
