import type { Labels, Options } from './types';

export const DEFAULT_HIGHLIGHT_PADDING = 8;
export const DEFAULT_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';
export const DEFAULT_HIGHLIGHT_BORDER_COLOR = '#ff0000';
export const DEFAULT_INFO_BOX_WIDTH = '20rem';
export const DEFAULT_Z_INDEX = 9999;
export const HIGHLIGHT_Z_INDEX_OFFSET = 1;
export const INFO_BOX_Z_INDEX_OFFSET = 2;

export const DEFAULT_LABELS: Required<Labels> = {
  prev: '이전',
  next: '다음',
  skip: '건너뛰기',
  done: '완료',
};

export function getLabels(options?: Options): Required<Labels> {
  return {
    ...DEFAULT_LABELS,
    ...options?.labels,
  };
}

export function getBaseZIndex(options?: Options): number {
  return options?.zIndex ?? DEFAULT_Z_INDEX;
}
