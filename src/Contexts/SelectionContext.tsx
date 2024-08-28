import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import Konva from 'konva';

interface SelectionContextType {
  selectedShape: string | null;
  setSelectedShape: React.Dispatch<React.SetStateAction<string | null>>;
  isEditingElement: boolean;
  setIsEditingElement: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCodeBlock: string | null;
  setSelectedCodeBlock: React.Dispatch<React.SetStateAction<string | null>>;
  codeBlockTransformerRef: React.RefObject<Konva.Transformer>;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [isEditingElement, setIsEditingElement] = useState(false);
  const [selectedCodeBlock, setSelectedCodeBlock] = useState<string | null>(null);
  const codeBlockTransformerRef = useRef<Konva.Transformer>(null);

  return (
    <SelectionContext.Provider 
      value={{ 
        selectedShape, 
        setSelectedShape, 
        isEditingElement, 
        setIsEditingElement,
        selectedCodeBlock,
        setSelectedCodeBlock,
        codeBlockTransformerRef
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelectionContext() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelectionContext must be used within a SelectionProvider');
  }
  return context;
}
