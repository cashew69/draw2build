import React from 'react';

interface CodeBlockNameHandlerProps {
  index: number;
  currentName: string;
  setRenamingCodeBlock: (id: string | null) => void;
  setTempName: (name: string) => void;
  updateCodeBlockName: (index: number, name: string) => void;
}

export const useCodeBlockNameHandler = ({
  index,
  currentName,
  setRenamingCodeBlock,
  setTempName,
  updateCodeBlockName,
}: CodeBlockNameHandlerProps) => {
  const handleRename = () => {
    setRenamingCodeBlock(`codeBlock${index}`);
    setTempName(currentName);
  };

  const handleSaveName = () => {
    updateCodeBlockName(index, currentName);
    setRenamingCodeBlock(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  return { handleRename, handleSaveName, handleNameChange };
};