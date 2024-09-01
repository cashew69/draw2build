import { createContext, useContext, useState } from "react";
import { CustomRect, CustomLine, CustomArrow, CustomText, CustomCodeBlock } from "../types";

interface ShapesContextType {
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
  updateCodeContent: (index: number, content: string) => void;
  deleteShape: (id: string) => void;
  updateShapeElement: (uid: string, element: string) => void;
  updateCodeBlockDimensions: (index: number, width: number, height: number) => void;
  saveShapes: () => void;
  loadShapes: () => void;
}

const ShapesContext = createContext<ShapesContextType | undefined>(undefined);

export const ShapesProvider = ({ children }: { children: React.ReactNode }) => {
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

  const updateCodeContent = (index: number, content: string) => {
    const updatedCodeBlocks = codeBlocks.map((codeBlock, i) =>
      i === index ? { ...codeBlock, content } : codeBlock,
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

    // Function to update the element property of a shape
    const updateShapeElement = (id: string, element: string) => {
        const shapeType = id.replace(/\d+$/, '');
        const index = parseInt(id.match(/\d+$/)?.[0] || '0', 10);
        
        switch (shapeType) {
          case 'rect':
            setRectangles((prevRectangles) =>
              prevRectangles.map((rect, i) =>
                i === index ? { ...rect, element } : rect
              )
            );
            break;
          case 'line':
            setLines((prevLines) =>
              prevLines.map((line, i) =>
                i === index ? { ...line, element } : line
              )
            );
            break;
          case 'arrow':
            setArrows((prevArrows) =>
              prevArrows.map((arrow, i) =>
                i === index ? { ...arrow, element } : arrow
              )
            );
            break;
          case 'text':
            setTexts((prevTexts) =>
              prevTexts.map((text, i) =>
                i === index ? { ...text, element } : text
              )
            );
            break;
          case 'codeBlock':
            setCodeBlocks((prevCodeBlocks) =>
              prevCodeBlocks.map((codeBlock, i) =>
                i === index ? { ...codeBlock, element } : codeBlock
              )
            );
            break;
        }
      };

  const updateCodeBlockDimensions = (index: number, width: number, height: number) => {
    const updatedCodeBlocks = codeBlocks.map((codeBlock, i) =>
      i === index ? { ...codeBlock, width, height } : codeBlock
    );
    setCodeBlocks(updatedCodeBlocks);
  };

  // Save shapes to a JSON file
  const saveShapes = () => {
    const shapes = {
      rectangles,
      lines,
      arrows,
      texts,
      codeBlocks,// Add connections to the saved data
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

  return (
    <ShapesContext.Provider value={{
      rectangles,
      lines,
      arrows,
      texts,
      codeBlocks,
      addRectangle,
      addLine,
      addArrow,
      addText,
      addCodeBlock,
      updateRectPosition,
      updateLinePosition,
      updateArrowPosition,
      updateTextPosition,
      updateCodeBlockPosition,
      updateCodeContent,
      deleteShape,
      updateShapeElement,
      updateCodeBlockDimensions,
      saveShapes,
      loadShapes,
    }}>
      {children}
    </ShapesContext.Provider>
  );
};

export const useShapesContext = () => {
  const context = useContext(ShapesContext);
  if (!context) {
    throw new Error("useShapesContext must be used within a ShapesProvider");
  }
  return context;
};