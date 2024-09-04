import Canvas from "./Canvas.tsx";
import { ToolProvider } from "./Contexts/ToolContext.tsx";
import { ShapesProvider } from "./Contexts/ShapesContext.tsx";
import { StageProvider } from './Contexts/StageContext.tsx';
import ToolPanel from "./toolPanel.tsx";
import { SelectionProvider } from "./Contexts/SelectionContext.tsx";
import { CodeBlockMap } from './Contexts/filename-uid.tsx';
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
    <CodeBlockMap>
      <ShapesProvider>
        <ToolProvider>
          <StageProvider>
          <SelectionProvider>
            <AppContent />
          </SelectionProvider>
          </StageProvider>
        </ToolProvider>
      </ShapesProvider>
    </CodeBlockMap>
  );
}

/*Now We are going to do cool part, I want to implement, If codeblock is named as <somename>.py then check for import statements, and if import name file exists in our CodeBlockProvider Context then 
 */