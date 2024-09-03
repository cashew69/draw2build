import Konva from "konva";
import { TransformerConfig } from 'konva/lib/shapes/Transformer';
import { CustomCodeBlock } from '../types'; // Assuming you have a CodeBlock type defined

export const handleCodeBlockTransform = (
  index: number,
  e: Konva.KonvaEventObject<Event>,
  codeBlocks: CustomCodeBlock[],
  updateCodeBlockPosition: (index: number, x: number, y: number) => void,
  updateCodeBlockDimensions: (index: number, width: number, height: number) => void
) => {
  const node = e.target as Konva.Group;
  const scaleX = node.scaleX();
  const scaleY = node.scaleY();

  // Update width and height, reset scale
  const newWidth = Math.max(Math.round(node.width() * scaleX), 100);
  const newHeight = Math.max(Math.round(node.height() * scaleY), 50);

  // Directly update the node
  node.width(newWidth);
  node.height(newHeight);
  
  // Update the codeBlocks array with new dimensions
  codeBlocks[index] = {
    ...codeBlocks[index],
    width: newWidth,
    height: newHeight
  };
  updateCodeBlockPosition(index, node.x(), node.y());
  updateCodeBlockDimensions(index, newWidth, newHeight);
  node.scaleX(1);
  node.scaleY(1);

  // Update the rectangle and HTML content inside the group
  const rect = node.findOne('Rect') as Konva.Rect;
  const htmlLayer = node.findOne('HTMLLayer') as any; // Konva doesn't have a specific type for HTML layers

  if (rect) {
    rect.width(newWidth);
    rect.height(newHeight);
  }

  if (htmlLayer) {
    htmlLayer.setSize({ width: newWidth, height: newHeight });
  }
};

export const codeBlockTransformerConfig: TransformerConfig = {
  enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'],
  boundBoxFunc: (oldBox, newBox) => {
    // Limit minimum size
    if (newBox.width < 100) newBox.width = 100;
    if (newBox.height < 50) newBox.height = 50;
    return newBox;
  },
  keepRatio: false,
  rotateEnabled: false,
};
