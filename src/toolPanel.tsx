import React from "react";
import "./toolPanel.css";

interface ToolPanelProps {
  setTool: (tool: string) => void;
  saveShapes: () => void;
  loadShapes: () => void;
}

function ToolPanel({ setTool, saveShapes, loadShapes }: ToolPanelProps) {
  return (
    <div className="tool-panel">
      <button onClick={() => setTool("selection")}>Selection</button>
      <button onClick={() => setTool("rect")}>Rectangle</button>
      <button onClick={() => setTool("line")}>Line</button>
      <button onClick={() => setTool("arrow")}>Arrow</button>
      <button onClick={() => setTool("text")}>Text</button>
      <button onClick={saveShapes}>Save</button>
      <button onClick={loadShapes}>Load</button>
    </div>
  );
}

export default ToolPanel;
