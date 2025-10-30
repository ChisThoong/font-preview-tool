
export type TextAlign = 'left' | 'center' | 'right';

export interface TextShadow {
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export interface TextOutline {
  enabled: boolean;
  width: number;
  color: string;
}

export interface TextOptions {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  textAlign: TextAlign;
  shadow: TextShadow;
  outline: TextOutline;
}

export interface BackgroundOptions {
  color: string;
  transparent: boolean;
}

export interface UploadedFont {
  name: string;
}

export interface Font {
  name: string;
  family: string;
}
