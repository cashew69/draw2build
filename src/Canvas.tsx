import React, { useEffect, useRef, useState } from "react";
// Importing necessary components from react-konva for rendering on canvas
import {
  Stage,
  Layer,
  Rect,
  Line,
  Text,
  Arrow,
  Transformer,
} from "react-konva";
import SelectionBox from "./selectionbox"; // For selection tool
import Konva from "konva";
import RectTool from "./rectTool"; // For drawing rectangles
import LineTool from "./lineTool"; // For drawing lines
import ArrowTool from "./arrowTool"; // For drawing arrows
import { SetElement, elementtext } from "./setElement"; // For adding text
import { CustomRect, CustomLine, CustomArrow, CustomText } from "./types"; // Types for shapes
import { TextBox } from "./TextBox";

function ShortId(): string {
  const timestamp = Date.now().toString(36).substr(3, 3); // Convert timestamp to base-36
  const randomString = Math.random().toString(36).substr(2, 2); // Generate a random 5-character string
  return `${timestamp}-${randomString}`;
}

// Main Canvas component where the drawing happens
function Canvas({
  tool, // The current tool selected by the user
  rectangles, // Array of rectangles to be drawn
  lines, // Array of lines to be drawn
  arrows, // Array of arrows to be drawn
  texts, // Array of texts to be drawn
  addRectangle, // Function to add a rectangle
  addLine, // Function to add a line
  addArrow, // Function to add an arrow
  addText, // Function to add a text
  updateTextPosition, // Function to update position of a text
  updateRectPosition, // Function to update position of a rectangle
  updateLinePosition, // Function to update position of a line
  updateArrowPosition, // Function to update position of an arrow
  updateShapeElement,
  deleteShape, // Function to delete a selected shape
}: {
  tool: string;
  rectangles: CustomRect[];
  lines: CustomLine[];
  arrows: CustomArrow[];
  texts: CustomText[];
  addRectangle: (rect: CustomRect) => void;
  addLine: (line: CustomLine) => void;
  addArrow: (arrow: CustomArrow) => void;
  addText: (text: CustomText) => void;
  updateTextPosition: (index: number, x: number, y: number) => void;
  updateRectPosition: (index: number, x: number, y: number) => void;
  updateLinePosition: (index: number, x: number, y: number) => void;
  updateArrowPosition: (index: number, x: number, y: number) => void;
  updateShapeElement: (id: string, element: string) => void;
  deleteShape: (id: string) => void;
}) {
  // References for the stage and transformer (used for manipulating shapes)
  const stageRef = React.useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null); // State to track the selected shape
  const [isEditingElement, setIsEditingElement] = useState(false);

  console.log(texts);
  // Function to handle key down events, specifically for deleting shapes
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Delete" && selectedShape) {
      deleteShape(selectedShape); // Delete the selected shape if 'Delete' key is pressed
      setSelectedShape(null); // Deselect the shape after deletion
    } else if (e.key === "/" && selectedShape) {
      setIsEditingElement(true); // Enable editing when slash key is pressed
    }
  };
  const handleElementSet = () => {
    if (selectedShape) {
      const selectedNode = stageRef.current?.findOne(`#${selectedShape}`);
      const uid = selectedNode?.getAttr("uid");

      updateShapeElement(uid, elementtext);
      console.log(
        `UID: ${uid}, Shape: ${selectedShape}, Node: ${selectedNode}`,
      );
      setIsEditingElement(false); // Disable editing after element is set
    }
  };

  // Add event listener for keydown on mount and remove on unmount
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedShape]);

  // Update transformer when selected shape changes
  useEffect(() => {
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      if (selectedShape) {
        const selectedNode = stageRef.current?.findOne(`#${selectedShape}`);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer()?.batchDraw();
        }
      }
    }
  }, [selectedShape]);

  // Function to handle selecting a shape
  const handleSelect = (e: Konva.KonvaEventObject<MouseEvent>, id: string) => {
    setSelectedShape(id); // Set the selected shape's ID
  };

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={(e) => {
          if (e.target === stageRef.current) {
            setSelectedShape(null); // Deselect if clicking on empty space
          }
        }}
      >
        <Layer>
          {tool === "selection" && <SelectionBox stageRef={stageRef} />}
          {tool === "rect" && (
            <RectTool
              stageRef={stageRef}
              addRectangle={(rect) => {
                const newRect = { ...rect, uid: ShortId(), element: "" }; // Assign UUID
                addRectangle(newRect);
              }}
            />
          )}
          {tool === "line" && (
            <LineTool
              stageRef={stageRef}
              addLine={(line) => {
                const newLine = { ...line, uid: ShortId(), element: "" }; // Assign UUID
                addLine(newLine);
              }}
            />
          )}
          {tool === "arrow" && (
            <ArrowTool
              stageRef={stageRef}
              addArrow={(arrow) => {
                const newArrow = { ...arrow, uid: ShortId(), element: "" }; // Assign UUID
                addArrow(newArrow);
              }}
            />
          )}
          {tool === "text" && (
            <TextBox
              stageRef={stageRef}
              addText={(text) => {
                const newText = { ...text, uid: ShortId(), element: "" }; // Assign UUID
                console.log(newText);
                addText(newText);
              }}
            />
          )}

          {/* Rendering all rectangles */}
          {rectangles.map((rect, i) => (
            <Rect
              key={i}
              {...rect}
              id={`rect${i}`}
              fill="transparent"
              stroke="black"
              draggable
              className="selectable"
              onClick={(e) => handleSelect(e, `rect${i}`)}
              onDragEnd={(e) => {
                updateRectPosition(i, e.target.x(), e.target.y());
              }}
            />
          ))}
          {/* Rendering all lines */}
          {lines.map((line, i) => (
            <Line
              key={i}
              {...line}
              points={line.points}
              stroke="black"
              id={`line${i}`}
              draggable
              className="selectable"
              onClick={(e) => handleSelect(e, `line${i}`)}
              onDragEnd={(e) => {
                updateLinePosition(i, e.target.x(), e.target.y());
              }}
            />
          ))}
          {/* Rendering all arrows */}
          {arrows.map((arrow, i) => (
            <Arrow
              key={i}
              {...arrow}
              points={arrow.points}
              stroke="black"
              id={`arrow${i}`}
              draggable
              className="selectable"
              onClick={(e) => handleSelect(e, `arrow${i}`)}
              onDragEnd={(e) => {
                updateArrowPosition(i, e.target.x(), e.target.y());
              }}
            />
          ))}
          {texts.map((text, i) => (
            <Text
              key={i}
              {...text}
              x={text.x}
              y={text.y}
              text={text.text}
              fontSize={15}
              id={`text${i}`}
              draggable
              className="selectable"
              onClick={(e) => handleSelect(e, `text${i}`)}
              onDragEnd={(e) => {
                updateTextPosition(i, e.target.x(), e.target.y());
              }}
            />
          ))}
          {isEditingElement && <SetElement onElementSet={handleElementSet} />}
          {/* Transformer for resizing and rotating shapes */}
          <Transformer ref={transformerRef} ignoreStroke={true} />
        </Layer>
      </Stage>
    </div>
  );
}

export default Canvas;

/*
Overview

The Canvas.tsx component is a crucial part of the application, responsible for rendering the canvas where users can draw and interact with shapes like rectangles, lines, arrows, and text. It also includes the ability to select, move, and delete these shapes.
Components and Tools

    Stage:
        The main area where all drawing takes place. It represents the entire canvas.

    Layer:
        A container for shapes. All shapes are added to this layer, making it easier to manage and redraw.

    Rect, Line, Arrow, Text:
        Konva shapes used for drawing rectangles, lines, arrows, and text on the canvas.

    Transformer:
        A tool that allows users to resize and rotate selected shapes.

    Custom Tools:
        SelectionBox: Allows users to select multiple shapes at once.
        RectTool: Tool for drawing rectangles.
        LineTool: Tool for drawing lines.
        ArrowTool: Tool for drawing arrows.
        TextTool: Tool for adding text.

State Management

    selectedShape:
        Tracks which shape is currently selected by the user. This is used to apply transformations like resizing and moving.

Key Functionalities

    Adding Shapes:
        Depending on the selected tool, users can add rectangles, lines, arrows, or text to the canvas. The corresponding tool component (RectTool, LineTool, ArrowTool, TextTool) handles this.

    Selecting Shapes:
        Users can click on any shape to select it. When selected, a Transformer appears around the shape, allowing it to be resized or rotated.

    Moving Shapes:
        Shapes can be dragged around the canvas. When a drag ends, the new position of the shape is updated.

    Deleting Shapes:
        If a shape is selected and the Delete key is pressed, the shape is removed from the canvas.

    Key Down Event:
        The component listens for the Delete key to delete the currently selected shape.

How It Works

    The Canvas component starts by rendering a Stage and a Layer. The Stage represents the whole canvas area, and the Layer contains all the shapes.

    Based on the currently selected tool (tool prop), the appropriate tool component (RectTool, LineTool, ArrowTool, TextTool) is activated, allowing users to draw that shape on the canvas.

    Shapes are drawn and stored in arrays (rectangles, lines, arrows, texts). These arrays are iterated over, and each shape is rendered on the canvas using Konva's shape components (Rect, Line, Arrow, Text).

    The Transformer component is used to apply transformations (resize, rotate) to the selected shape. When a shape is selected, its ID is stored in the selectedShape state, and the Transformer is attached to it.

    Users can drag shapes around the canvas. When they finish dragging, the position is updated in the state to reflect the new coordinates.

    If a shape is selected, pressing the Delete key will remove it from the canvas.

This setup allows for an interactive drawing experience, where users can easily switch between tools, draw various shapes, move them around, and remove them when necessary.

*/
