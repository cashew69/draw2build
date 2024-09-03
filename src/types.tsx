
export interface CustomRect {
  x: number;
  y: number;
  width: number;
  height: number;
  connections?: string[] | null;
  uid?: string;
}

export interface CustomLine {
  points: number[];
  connections?: string[] | null;
  uid?: string;
}

export interface CustomArrow {
  points: number[];
  connections?: string[] | null;
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
  connections?: string[] | null;
  uid?: string;
}

export interface CustomCodeBlock {
  uid: string;
  x: number;
  y: number;
  name: string;
  width: number;
  height: number;
  content: string;
  language: string;
  theme: string;
  connections?: string[] | null;
}

export interface CustomTemplate {
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  content: string;
  connections?: string[] | null;
  uid?: string;
}