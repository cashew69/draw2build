import React, { useCallback } from 'react';
import { useShapesContext } from '../Contexts/ShapesContext';
import { useSelectionContext } from '../Contexts/SelectionContext';
import { useToolContext } from '../Contexts/ToolContext';
import { useStageContext } from '../Contexts/StageContext';
import Konva from 'konva';

export function useCanvasEventHandlers(stageRef: React.RefObject<Konva.Stage>) {
  const { deleteShape, updateShapeElement, rectangles, lines, arrows, texts, codeBlocks } = useShapesContext();
  const { selectedShape, setSelectedShape, setIsEditingElement, selectedCodeBlock, setSelectedCodeBlock } = useSelectionContext();
  const { tool, setTool } = useToolContext();
  const { setStageDrag } = useStageContext();

  const [isSpacePressed, setIsSpacePressed] = React.useState(false);
  const [prevTool, setPrevTool] = React.useState("");

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    console.log("Key pressed:", e.key);
    if (e.key === "Delete") {
      console.log("Delete key pressed. Current selected shape:", selectedShape);
      if (selectedShape) {
        deleteShape(selectedShape);

        console.log("After deleteShape call. Shapes count:", {
          rectangles: rectangles.length,
          lines: lines.length,
          arrows: arrows.length,
          texts: texts.length,
          codeBlocks: codeBlocks.length
        });
        setSelectedShape(null);
        console.log("Selected shape cleared");
      } else if (selectedCodeBlock) {
        console.log("Selected code block:", selectedCodeBlock);
        deleteShape(selectedCodeBlock);
        setSelectedCodeBlock(null);
        console.log("Selected code block cleared");
      } else {
        console.log("No shape or code block selected for deletion");
      }
    } 
    else if (e.key === "/" && selectedShape) {
      setIsEditingElement(true); // Enable editing when slash key is pressed
    } 
    else if (e.key === " " && !isSpacePressed) {
      e.preventDefault();
      setIsSpacePressed(true);
      setPrevTool(tool);
      setStageDrag(true);
      setTool("none");
    }
  }, [selectedShape, deleteShape, setSelectedShape, rectangles, lines, arrows, texts, codeBlocks, selectedCodeBlock, setSelectedCodeBlock, setIsEditingElement, isSpacePressed, tool, setStageDrag, setTool]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === " ") {
      setIsSpacePressed(false);
      setStageDrag(false);
      setTool(prevTool);
    }
  }, [setStageDrag, setTool, prevTool]);

  const handleElementSet = useCallback(() => {
    if (selectedShape) {
      const selectedNode = stageRef.current?.findOne(`#${selectedShape}`);
      const uid = selectedNode?.getAttr("uid");

      updateShapeElement(uid, "elementtext"); // Note: You might need to pass elementtext as a parameter
      setIsEditingElement(false); // Disable editing after element is set
    }
  }, [selectedShape, stageRef, updateShapeElement, setIsEditingElement]);

  const handleSelect = (e: Konva.KonvaEventObject<MouseEvent>, id: string) => {
    console.log("Shape selected:", id);
    setSelectedShape(id);
  };

  const handleCodeBlockSelect = (e: Konva.KonvaEventObject<MouseEvent>, id: string) => {
    setSelectedCodeBlock(id);
    setSelectedShape(null);
  };

  return {
    handleKeyDown,
    handleKeyUp,
    handleElementSet,
    handleSelect,
    handleCodeBlockSelect,
  };
};
