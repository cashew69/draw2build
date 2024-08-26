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
  textX?: number;
  textY?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  draggable?: boolean;
  text: string;
  element?: string | null;
  uid?: string;
}

export interface CustomCodeBlock {
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  content: string;
  uid?: string;
}

export interface CustomTemplate {
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  content: string;
  element?: string | null;
  uid?: string;
}
