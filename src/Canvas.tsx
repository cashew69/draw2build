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
  Group,
} from "react-konva";
import SelectionBox from "./selectionbox"; // For selection tool
import Konva from "konva";
import RectTool from "./rectTool"; // For drawing rectangles
import LineTool from "./lineTool"; // For drawing lines
import ArrowTool from "./arrowTool"; // For drawing arrows
import { SetElement, elementtext } from "./setElement"; // For adding text
import { CustomRect, CustomLine, CustomArrow, CustomText, CustomCodeBlock } from "./types"; // Types for shapes
import { TextBox } from "./TextBox";
import CodeBlockTool from "./codeBlockTool";
import { Html } from "react-konva-utils";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

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
  codeBlocks, // Array of code blocks to be drawn
  addRectangle, // Function to add a rectangle
  addLine, // Function to add a line
  addArrow, // Function to add an arrow
  addText, // Function to add a text
  addCodeBlock, // Function to add a code block
  updateTextPosition, // Function to update position of a text
  updateRectPosition, // Function to update position of a rectangle
  updateLinePosition, // Function to update position of a line
  updateArrowPosition, // Function to update position of an arrow
  updateCodeBlockPosition, // Function to update position of a code block
  updateShapeElement,
  deleteShape, // Function to delete a selected shape
}: {
  tool: string;
  rectangles: CustomRect[];
  lines: CustomLine[];
  arrows: CustomArrow[];
  texts: CustomText[];
  codeBlocks: CustomCodeBlock[];
  addRectangle: (rect: CustomRect) => void;
  addLine: (line: CustomLine) => void;
  addArrow: (arrow: CustomArrow) => void;
  addText: (text: CustomText) => void;
  addCodeBlock: (codeBlock: CustomCodeBlock) => void;
  updateTextPosition: (index: number, x: number, y: number) => void;
  updateRectPosition: (index: number, x: number, y: number) => void;
  updateLinePosition: (index: number, x: number, y: number) => void;
  updateArrowPosition: (index: number, x: number, y: number) => void;
  updateCodeBlockPosition: (index: number, x: number, y: number) => void;
  updateShapeElement: (id: string, element: string) => void;
  deleteShape: (id: string) => void;
}) {
  // Infinte Canvas <----
  const WIDTH = 100;
  const HEIGHT = 100;

  const grid = [
    ["white", "white"],
    ["white", "white"],
  ];
  const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = React.useState(1);
  const [stageDrag, setStageDrag] = React.useState(false);
  const [prevTool, setprevTool] = React.useState("");
  const startX = Math.floor((-stagePos.x - window.innerWidth) / WIDTH) * WIDTH;
  const endX =
    Math.floor((-stagePos.x + window.innerWidth * 2) / WIDTH) * WIDTH;

  const startY =
    Math.floor((-stagePos.y - window.innerHeight) / HEIGHT) * HEIGHT;
  const endY =
    Math.floor((-stagePos.y + window.innerHeight * 2) / HEIGHT) * HEIGHT;

  const gridComponents = [];
  var i: number = 0;
  for (var x: number = startX; x < endX; x += WIDTH) {
    for (var y: number = startY; y < endY; y += HEIGHT) {
      if (i === 4) {
        i = 0;
      }

      const indexX = Math.abs(x / WIDTH) % grid.length;
      const indexY = Math.abs(y / HEIGHT) % grid[0].length;

      gridComponents.push(
        <Rect
          x={x}
          y={y}
          width={WIDTH}
          height={HEIGHT}
          fill={grid[indexX][indexY]}
          stroke="black"
        />,
      );
    }
  }

  // ---->
  // zoom in and out
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageScale(newScale);
    const stageX =
      -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale;
    const stageY =
      -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale;
    setStagePos({ x: stageX, y: stageY });
  };

  // References for the stage and transformer (used for manipulating shapes)
  const stageRef = React.useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null); // State to track the selected shape
  const [isEditingElement, setIsEditingElement] = useState(false);

  // Function to handle key down events, specifically for deleting shapes
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Delete" && selectedShape) {
      deleteShape(selectedShape); // Delete the selected shape if 'Delete' key is pressed
      setSelectedShape(null); // Deselect the shape after deletion
    } else if (e.key === "/" && selectedShape) {
      setIsEditingElement(true); // Enable editing when slash key is pressed
    } else if (e.key === " ") {
      setStageDrag(true); // Enable dragging when Space key is pressed}
      setprevTool(tool);
      tool = "line";
    }
  };

  console.log(codeBlocks);
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === " ") {
      setStageDrag(false); // disable dragging when Space key is not pressed}
      tool = prevTool;
      setprevTool("");
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
    window.addEventListener("keyup", handleKeyUp);
    //window.addEventListener("wheel", handlew)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedShape, stageDrag]);

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
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={stageDrag}
        onDragEnd={(e) => {
          setStagePos(e.currentTarget.position());
        }}
        ref={stageRef}
        onMouseDown={(e) => {
          if (e.target === stageRef.current) {
            setSelectedShape(null); // Deselect if clicking on empty space
          }
        }}
      >
        <Layer>
          {gridComponents}

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
                addText(newText);
              }}
              />
            )}
            {tool === "CodeBlock" && (
              <CodeBlockTool
                stageRef={stageRef}
                addCodeBlock={(codeBlock) => {
                  const newCodeBlock = { ...codeBlock, uid: ShortId(), element: "" };
                  addCodeBlock(newCodeBlock);
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
              width={text.width}
              height={text.height}
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
          {/* Rendering all code blocks */}
          {codeBlocks.map((codeBlock, i) => (
            <Group
              key={i}
              x={codeBlock.x}
              y={codeBlock.y}
              id={`codeBlock${i}`}
              draggable
              onClick={(e) => handleSelect(e, `codeBlock${i}`)}
              onDragEnd={(e) => {
                updateCodeBlockPosition(i, e.target.x(), e.target.y());
              }}
            >
              <Rect
                width={codeBlock.width}
                height={codeBlock.height}
                fill="white"
                stroke="black"
                strokeWidth={1}
              />
              <Html>
                <div style={{ width: `${codeBlock.width}px`, height: `${codeBlock.height}px`, overflow: 'hidden' }}>
                  <CodeMirror
                    value={codeBlock.content}
                    height={`${codeBlock.height}px`}
                    extensions={[javascript({ jsx: true })]}
                    editable={true}
                  />
                </div>
              </Html>
            </Group>
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
