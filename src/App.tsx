import Canvas from "./Canvas.tsx";
import ToolPanel from "./toolPanel.tsx";
import { useState } from "react";
import { CustomRect, CustomLine, CustomArrow, CustomText, CustomCodeBlock } from "./types";
import CodeBlockTool from "./codeBlockTool.tsx";

export function App() {
  const [tool, setTool] = useState("selection");
  const [rectangles, setRectangles] = useState<CustomRect[]>([]);
  const [lines, setLines] = useState<CustomLine[]>([]);
  const [arrows, setArrows] = useState<CustomArrow[]>([]);
  const [texts, setTexts] = useState<CustomText[]>([]);
  const [codeBlocks, setCodeBlocks] = useState<CustomCodeBlock[]>([]);

  const addRectangle = (rect: CustomRect) =>
    setRectangles([...rectangles, rect]);
  const addLine = (line: CustomLine) => setLines([...lines, line]);
  const addArrow = (arrow: CustomArrow) => setArrows([...arrows, arrow]);
  const addText = (text: CustomText) => setTexts([...texts, text]);
  const addCodeBlock = (codeBlock: CustomCodeBlock) => setCodeBlocks([...codeBlocks, codeBlock]);

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

  const updateCodeBlockPosition = (index: number, x: number, y: number) => {
    const updatedCodeBlocks = codeBlocks.map((codeBlock, i) =>
      i === index ? { ...codeBlock, x, y } : codeBlock,
    );
    setCodeBlocks(updatedCodeBlocks);
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
    } else if (id.startsWith("none")) {
      const index = parseInt(id.replace("none", ""));
      setTexts(texts.filter((_, i) => i !== index));
    } else if (id.startsWith("codeBlock")) {
      const index = parseInt(id.replace("codeBlock", ""));
      setCodeBlocks(codeBlocks.filter((_, i) => i !== index));
    }
  };

  // Save shapes to a JSON file
  const saveShapes = () => {
    const shapes = {
      rectangles,
      lines,
      arrows,
      texts,
      codeBlocks,
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
        setCodeBlocks(shapesData.codeBlocks || []);
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
    setCodeBlocks((prevCodeBlocks) =>
      prevCodeBlocks.map((codeBlock) => (codeBlock.uid === uid ? { ...codeBlock, element } : codeBlock)),
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
        codeBlocks={codeBlocks}
        addRectangle={addRectangle}
        addLine={addLine}
        addArrow={addArrow}
        addText={addText}
        addCodeBlock={addCodeBlock}
        updateTextPosition={updateTextPosition}
        updateRectPosition={updateRectPosition}
        updateLinePosition={updateLinePosition}
        updateArrowPosition={updateArrowPosition}
        updateCodeBlockPosition={updateCodeBlockPosition}
        deleteShape={deleteShape}
        updateShapeElement={updateShapeElement}
      />
    </div>
  );
}
