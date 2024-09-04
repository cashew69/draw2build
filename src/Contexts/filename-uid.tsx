import React, { createContext, useState, useContext, useEffect } from 'react';

interface CodeBlockMap {
  [name: string]: string; // name: UID
}

interface CodeBlockContextType {
  codeBlockMap: CodeBlockMap;
  setCodeBlock: (name: string, uid: string) => void;
  getUID: (name: string) => string | undefined;
}

const initialCodeBlockMap: CodeBlockMap = {};

const CodeBlockContext = createContext<CodeBlockContextType | undefined>(undefined);

export function CodeBlockMap({ children }: { children: React.ReactNode }) {
  const [codeBlockMap, setCodeBlockMap] = useState<CodeBlockMap>(initialCodeBlockMap);

  const setCodeBlock = (name: string, uid: string) => {
    setCodeBlockMap(prevMap => {
      const newMap = { ...prevMap, [name]: uid };
      console.log('CodeBlock added/updated:', { name, uid });
      console.log('Current CodeBlock Context:', newMap);
      return newMap;
    });
  };

  const getUID = (name: string) => codeBlockMap[name];

  // Log the entire context whenever it changes
  useEffect(() => {
    console.log('CodeBlock Context updated:', codeBlockMap);
  }, [codeBlockMap]);

  return (
    <CodeBlockContext.Provider value={{ codeBlockMap, setCodeBlock, getUID }}>
      {children}
    </CodeBlockContext.Provider>
  );
}

export function useCodeBlockMap() {
  const context = useContext(CodeBlockContext);
  if (context === undefined) {
    throw new Error('useCodeBlock must be used within a CodeBlockProvider');
  }
  return context;
}
