import React from 'react';
import { ActionType, dispatch, useTutorialStore } from '../core/store';
import { styled } from 'goober';

export const Content = React.forwardRef((_, ref?: React.ForwardedRef<HTMLInputElement>) => {
  const {
    index,
    tutorial: { steps },
  } = useTutorialStore();
  const currentStep = steps[index];
  const { onPrevStep, onNextStep } = currentStep;

  const handlePrev = () => {
    onPrevStep?.();
    dispatch({ type: ActionType.PREV });
  };

  const handleNext = () => {
    onNextStep?.();
    dispatch({ type: ActionType.NEXT });
  };

  const handleClose = () => {
    dispatch({ type: ActionType.CLOSE });
  };

  return (
    <Wrapper ref={ref}>
      <Heander>
        <InfoTitle>
          <p>{currentStep.title}</p>
          <button onClick={handleClose}>건너뛰기</button>
        </InfoTitle>
        <InfoContent dangerouslySetInnerHTML={{ __html: currentStep.content ?? '' }} />
      </Heander>
      <Footer className="flex items-center justify-between">
        <InfoSteps className="text-[.75rem] font-medium text-sub-2.5">
          <span>{`${index + 1} / ${steps.length}`}</span>
        </InfoSteps>
        <ButtonWrapper className="flex gap-[.625rem]">
          {index !== 0 && <button onClick={handlePrev}>이전</button>}
          <button onClick={handleNext}>{index === steps.length - 1 ? '완료' : '다음'}</button>
        </ButtonWrapper>
      </Footer>
    </Wrapper>
  );
});

const Wrapper = styled('div', React.forwardRef)`
  position: absolute;
  top: 6.25rem;
  z-index: 999;
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

const InfoTitle = styled('div')`
  display: flex;
  align-items: center;

  p {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f1f1f;
  }

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
