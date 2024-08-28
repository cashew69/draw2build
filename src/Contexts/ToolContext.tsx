
import { createContext, useContext, useState } from "react";

interface ToolContextType {
  tool: string;
  setTool: (tool: string) => void;
}

export const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const useToolContext = () => {
    const context = useContext(ToolContext);
    if (!context) {
        throw new Error("useToolContext must be used within a ToolProvider");
    }
    return context;
};

interface ToolProviderProps {
    children: React.ReactNode;
}

export const ToolProvider = ({ children }: ToolProviderProps) => {
    const [tool, setTool] = useState("none");

    return (
        <ToolContext.Provider value={{ tool, setTool }}>
            {children}
        </ToolContext.Provider>
    );
};

