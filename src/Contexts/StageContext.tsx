import React, { createContext, useContext, useState } from 'react';

interface StageContextType {
  stagePos: { x: number; y: number };
  setStagePos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  stageScale: number;
  setStageScale: React.Dispatch<React.SetStateAction<number>>;
  stageDrag: boolean;
  setStageDrag: React.Dispatch<React.SetStateAction<boolean>>;
  isCanvasing: boolean;
  setIsCanvasing: React.Dispatch<React.SetStateAction<boolean>>;
}

const StageContext = createContext<StageContextType | undefined>(undefined);

export const StageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);
  const [stageDrag, setStageDrag] = useState(false);
  const [isCanvasing, setIsCanvasing] = useState(false);

  return (
    <StageContext.Provider value={{
      stagePos,
      setStagePos,
      stageScale,
      setStageScale,
      stageDrag,
      setStageDrag,
      isCanvasing,
      setIsCanvasing,
    }}>
      {children}
    </StageContext.Provider>
  );
};

export const useStageContext = () => {
  const context = useContext(StageContext);
  if (context === undefined) {
    throw new Error('useStageContext must be used within a StageProvider');
  }
  return context;
};
