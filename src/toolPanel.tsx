import "./toolPanel.css";
import { useToolContext } from "./Contexts/ToolContext";
import { useShapesContext } from "./Contexts/ShapesContext";

function ToolPanel() {
  const { setTool } = useToolContext();
  const { saveShapes, loadShapes } = useShapesContext();
  return (
    <div className="tool-panel">
      <button onClick={() => setTool("none")}>None</button>
      <button onClick={() => setTool("CodeBlock")}>CodeBlock</button>
      <button onClick={() => setTool("selection")}>Selection</button>
      <button onClick={() => setTool("rect")}>Rectangle</button>
      <button onClick={() => setTool("line")}>Line</button>
      <button onClick={() => setTool("arrow")}>Arrow</button>
      <button onClick={() => setTool("text")}>Text</button>
      <button onClick={saveShapes}>Save</button>
      <button onClick={loadShapes}>Load</button>
      <button onClick={() => setTool("composerRect")}>Composer Rect</button>
    </div>
  );
}

export default ToolPanel;
