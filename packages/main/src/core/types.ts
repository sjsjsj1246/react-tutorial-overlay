export type StyleValue = number | string;
export type InfoBoxAlignment = 'center' | 'left' | 'right';

export interface Labels {
  prev?: string;
  next?: string;
  skip?: string;
  done?: string;
}

export interface StepOptions {
  infoBoxHeight?: number;
  infoBoxWidth?: StyleValue;
  infoBoxMargin?: number;
  highlightBorderColor?: string;
  highlightBorderRadius?: StyleValue;
  labels?: Labels;
}

export interface Step {
  targetIds: string[];
  content?: string;
  title?: string;
  infoBoxAlignment?: InfoBoxAlignment;
  options?: StepOptions;
  onPrevStep?: () => void;
  onNextStep?: () => void;
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
  startAt?: number;
}

export type TutorialResultReason = 'completed' | 'skipped' | 'closed' | 'replaced';

export interface TutorialResult {
  reason: TutorialResultReason;
}

export interface TutorialProgressState {
  open: boolean;
  index: number;
  stepCount: number;
  currentStep: Step | null;
}

export interface ElementStyle {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius?: StyleValue;
}
