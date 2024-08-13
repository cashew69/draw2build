import Canvas from "./Canvas.tsx";
import ToolPanel from "./toolPanel.tsx";
import { useState } from "react";
import { CustomRect, CustomLine, CustomArrow, CustomText } from "./types";

export function App() {
  const [tool, setTool] = useState("selection");
  const [rectangles, setRectangles] = useState<CustomRect[]>([]);
  const [lines, setLines] = useState<CustomLine[]>([]);
  const [arrows, setArrows] = useState<CustomArrow[]>([]);
  const [texts, setTexts] = useState<CustomText[]>([]);

  const addRectangle = (rect: CustomRect) =>
    setRectangles([...rectangles, rect]);
  const addLine = (line: CustomLine) => setLines([...lines, line]);
  const addArrow = (arrow: CustomArrow) => setArrows([...arrows, arrow]);
  const addText = (text: CustomText) => setTexts([...texts, text]);

  const updateTextPosition = (index: number, x: number, y: number) => {
    const updatedTexts = texts.map((text, i) =>
      i === index ? { ...text, x, y } : text,
    );
    setTexts(updatedTexts);
  };

  const updateRectPosition = (index: number, x: number, y: number) => {
    const updatedRects = rectangles.map((rect, i) =>
      i === index ? { ...rect, x, y } : rect,
    );
    setRectangles(updatedRects);
  };

  const updateLinePosition = (index: number, x: number, y: number) => {
    const updatedLines = lines.map((line, i) =>
      i === index ? { ...line, x, y } : line,
    );
    setLines(updatedLines);
  };

  const updateArrowPosition = (index: number, x: number, y: number) => {
    const updatedArrows = arrows.map((arrow, i) =>
      i === index ? { ...arrow, x, y } : arrow,
    );
    setArrows(updatedArrows);
  };

  const deleteShape = (id: string) => {
    if (id.startsWith("rect")) {
      const index = parseInt(id.replace("rect", ""));
      setRectangles(rectangles.filter((_, i) => i !== index));
    } else if (id.startsWith("line")) {
      const index = parseInt(id.replace("line", ""));
      setLines(lines.filter((_, i) => i !== index));
    } else if (id.startsWith("arrow")) {
      const index = parseInt(id.replace("arrow", ""));
      setArrows(arrows.filter((_, i) => i !== index));
    } else if (id.startsWith("text")) {
      const index = parseInt(id.replace("text", ""));
      setTexts(texts.filter((_, i) => i !== index));
    }
  };

  // Save shapes to a JSON file
  const saveShapes = () => {
    const shapes = {
      rectangles,
      lines,
      arrows,
      texts,
    };
    const blob = new Blob([JSON.stringify(shapes)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shapes.json";
    a.click();
    URL.revokeObjectURL(url); // Clean up after download
  };

  // Load shapes from a JSON file
  const loadShapes = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const shapesData = JSON.parse(text);
        setRectangles(shapesData.rectangles || []);
        setLines(shapesData.lines || []);
        setArrows(shapesData.arrows || []);
        setTexts(shapesData.texts || []);
      }
    };
    input.click();
  };

  // Function to update the element property of a shape
  const updateShapeElement = (uid: string, element: string) => {
    console.log("gotcall from updateele");
    setRectangles((prevRectangles) =>
      prevRectangles.map((rect) =>
        rect.uid === uid ? { ...rect, element } : rect,
      ),
    );
    setLines((prevLines) =>
      prevLines.map((line) => (line.uid === uid ? { ...line, element } : line)),
    );
    setArrows((prevArrows) =>
      prevArrows.map((arrow) =>
        arrow.uid === uid ? { ...arrow, element } : arrow,
      ),
    );
    setTexts((prevTexts) =>
      prevTexts.map((text) => (text.uid === uid ? { ...text, element } : text)),
    );
  };

  return (
    <div>
      <ToolPanel
        setTool={setTool}
        saveShapes={saveShapes}
        loadShapes={loadShapes}
      />

      <Canvas
        tool={tool}
        rectangles={rectangles}
        lines={lines}
        arrows={arrows}
        texts={texts}
        addRectangle={addRectangle}
        addLine={addLine}
        addArrow={addArrow}
        addText={addText}
        updateTextPosition={updateTextPosition}
        updateRectPosition={updateRectPosition}
        updateLinePosition={updateLinePosition}
        updateArrowPosition={updateArrowPosition}
        deleteShape={deleteShape}
        updateShapeElement={updateShapeElement}
      />
    </div>
  );
}
/*
Overview

The App.tsx file contains the main logic for the application. It manages different drawing tools and elements on a canvas, allowing users to draw rectangles, lines, arrows, and texts. It includes state management for these elements and functions to update their positions.
Components

    Canvas Component:
        Responsible for rendering the drawing canvas where users can interact with different shapes and texts.
        Receives the current tool and lists of shapes and texts as props.
        Functions to add and update elements are also passed as props.

    ToolPanel Component:
        Allows users to select different drawing tools (e.g., selection tool).
        Updates the tool state in the App component.

State Management

    tool: Keeps track of the currently selected tool. This can be "selection" or other tool names defined in the ToolPanel component.
    rectangles: Array of CustomRect objects representing all rectangles drawn on the canvas.
    lines: Array of CustomLine objects representing all lines drawn on the canvas.
    arrows: Array of CustomArrow objects representing all arrows drawn on the canvas.
    texts: Array of CustomText objects representing all text elements on the canvas.

Functions

    Adding Elements:
        addRectangle(rect: CustomRect): Adds a new rectangle to the rectangles array.
        addLine(line: CustomLine): Adds a new line to the lines array.
        addArrow(arrow: CustomArrow): Adds a new arrow to the arrows array.
        addText(text: CustomText): Adds a new text element to the texts array.

    Updating Positions:
        updateTextPosition(index: number, x: number, y: number): Updates the position of the text at the specified index.
        updateRectPosition(index: number, x: number, y: number): Updates the position of the rectangle at the specified index.
        updateLinePosition(index: number, x: number, y: number): Updates the position of the line at the specified index.
        updateArrowPosition(index: number, x: number, y: number): Updates the position of the arrow at the specified index.

Rendering

    The App component renders a div containing the ToolPanel and Canvas components.
    The ToolPanel is used to select the drawing tool.
    The Canvas receives all current drawing elements and functions to modify them as props.

This setup ensures that the application maintains a clean separation between the UI for selecting tools and the drawing canvas where users interact with shapes and text.

*/
