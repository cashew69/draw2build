import Canvas from "./Canvas.tsx";
import { ToolProvider } from "./Contexts/ToolContext.tsx";
import { ShapesProvider } from "./Contexts/ShapesContext.tsx";
import { StageProvider } from './Contexts/StageContext.tsx';
import ToolPanel from "./toolPanel.tsx";
import { SelectionProvider } from "./Contexts/SelectionContext.tsx";

function AppContent() {
  return (
    <div>
      <ToolPanel/>
      <Canvas/>
    </div>
  );
}

export function App() {
  return (
    <ShapesProvider>
      <ToolProvider>
        <StageProvider>
        <SelectionProvider>
          <AppContent />
        </SelectionProvider>
        </StageProvider>
      </ToolProvider>
    </ShapesProvider>
  );
}