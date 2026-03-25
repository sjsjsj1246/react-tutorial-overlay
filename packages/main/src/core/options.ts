import type { Labels, Options, Step, StyleValue } from './types';

export const DEFAULT_HIGHLIGHT_PADDING = 8;
export const DEFAULT_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';
export const DEFAULT_HIGHLIGHT_BORDER_COLOR = '#ff0000';
export const DEFAULT_INFO_BOX_HEIGHT = 200;
export const DEFAULT_INFO_BOX_WIDTH = '20rem';
export const DEFAULT_INFO_BOX_MARGIN = 30;
export const DEFAULT_Z_INDEX = 9999;
export const HIGHLIGHT_Z_INDEX_OFFSET = 1;
export const INFO_BOX_Z_INDEX_OFFSET = 2;

export const DEFAULT_LABELS: Required<Labels> = {
  prev: '이전',
  next: '다음',
  skip: '건너뛰기',
  done: '완료',
};

export function getLabels(options?: Options, step?: Step): Required<Labels> {
  return {
    ...DEFAULT_LABELS,
    ...options?.labels,
    ...step?.options?.labels,
  };
}

export function getBaseZIndex(options?: Options): number {
  return options?.zIndex ?? DEFAULT_Z_INDEX;
}

export function getInfoBoxHeight(options?: Options, step?: Step): number {
  return step?.options?.infoBoxHeight ?? options?.infoBoxHeight ?? DEFAULT_INFO_BOX_HEIGHT;
}

export function getInfoBoxWidth(options?: Options, step?: Step): StyleValue {
  return step?.options?.infoBoxWidth ?? options?.infoBoxWidth ?? DEFAULT_INFO_BOX_WIDTH;
}

export function getInfoBoxMargin(options?: Options, step?: Step): number {
  return step?.options?.infoBoxMargin ?? options?.infoBoxMargin ?? DEFAULT_INFO_BOX_MARGIN;
}

export function getHighlightBorderColor(options?: Options, step?: Step): string {
  return step?.options?.highlightBorderColor ?? options?.highlightBorderColor ?? DEFAULT_HIGHLIGHT_BORDER_COLOR;
}

export function getHighlightBorderRadius(
  options?: Options,
  step?: Step,
  fallbackBorderRadius?: StyleValue
): StyleValue | undefined {
  return step?.options?.highlightBorderRadius ?? options?.highlightBorderRadius ?? fallbackBorderRadius;
}
