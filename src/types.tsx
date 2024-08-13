// types.ts
export interface CustomRect {
  x: number;
  y: number;
  width: number;
  height: number;
  element?: string | null;
  uid?: string;
}

export interface CustomLine {
  points: number[];
  element?: string | null;
  uid?: string;
}

export interface CustomArrow {
  points: number[];
  element?: string | null;
  uid?: string;
}

export interface CustomText {
  x: number;
  y: number;
  text: string;
  element?: string | null;
  uid?: string;
}
