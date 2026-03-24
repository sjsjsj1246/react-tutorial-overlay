import '@testing-library/jest-dom';
import { cleanup, act } from '@testing-library/react';
import { tutorial } from '../src/core/tutorial';

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  configurable: true,
  value: jest.fn(),
  writable: true,
});

afterEach(() => {
  cleanup();
  act(() => {
    tutorial.close();
  });
  jest.clearAllMocks();
});
