export interface Step {
  targetIds: string[];
  content?: string;
  title?: string;
  infoBoxAlignment?: 'center' | 'left' | 'right';
  onPrevStep?: () => void;
  onNextStep?: () => void;
}

export interface Options {
  highLightPadding?: number;
  infoBoxHeight?: number;
  infoBoxMargin?: number;
  onClose?: () => void;
}

export interface Tutorial {
  steps: Step[];
  options?: Options;
}

export interface ElementStyle {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}
