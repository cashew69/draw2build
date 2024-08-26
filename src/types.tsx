import type { Extension } from "@uiw/react-codemirror";

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
  uid: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  language: string;
  theme: string;
  element: string;
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