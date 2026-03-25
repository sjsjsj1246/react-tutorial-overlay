export type StyleValue = number | string;

export interface Step {
  targetIds: string[];
  content?: string;
  title?: string;
  infoBoxAlignment?: 'center' | 'left' | 'right';
  onPrevStep?: () => void;
  onNextStep?: () => void;
}

export interface Labels {
  prev?: string;
  next?: string;
  skip?: string;
  done?: string;
}

export interface Options {
  highLightPadding?: number;
  infoBoxHeight?: number;
  infoBoxWidth?: StyleValue;
  infoBoxMargin?: number;
  overlayColor?: string;
  highlightBorderColor?: string;
  highlightBorderRadius?: StyleValue;
  zIndex?: number;
  labels?: Labels;
  keyboardNavigation?: boolean;
  closeOnOverlayClick?: boolean;
  onClose?: () => void;
}

export interface Tutorial {
  steps: Step[];
  options?: Options;
}

export type TutorialResultReason = 'completed' | 'skipped' | 'closed' | 'replaced';

export interface TutorialResult {
  reason: TutorialResultReason;
}

export interface ElementStyle {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius?: StyleValue;
}
