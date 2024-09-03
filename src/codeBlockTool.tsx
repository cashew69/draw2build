import React, { useState, useEffect } from "react";
import { Rect, Group, Text } from 'react-konva';
import { CustomCodeBlock } from './types';
import Konva from 'konva';
import CodeMirror from '@uiw/react-codemirror';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { Html } from 'react-konva-utils';

function CodeBlockTool({ stageRef, addCodeBlock }: {stageRef: React.RefObject<Konva.Stage>; addCodeBlock: (codeBlock: CustomCodeBlock) => void;}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPlacing, setIsPlacing] = useState(false);
  const [codeContent, setCodeContent] = useState("// Your code here");
  const [blockName, setBlockName] = useState("Untitleding");
  const [isNaming, setIsNaming] = useState(true);
  const stage = stageRef.current;
  const scale = stageRef.current?.scaleX() || 1;

  const handleMouseDown = (_: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();

    if (pos && !isPlacing) {
      setPosition({
        x: (pos.x - (stage?.x() || 0)) / scale,
        y: (pos.y - (stage?.y() || 0)) / scale,
      });
      setIsPlacing(true);
    }
  };

  

  const handleCodeChange = (value: string) => {
    setCodeContent(value);
    
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Name changed to:", e.target.value);
    setBlockName(e.target.value);
  };

  const handleSaveName = () => {
    console.log("Saving name:", blockName);
    const newCodeBlockProps: CustomCodeBlock = {
      uid: '', // This will be set in Canvas component
      name: blockName,
      x: position.x,
      y: position.y,
      width: 300,
      height: 170, // Increased height to accommodate name input
      content: codeContent,
      language: 'python',
      theme: 'okaidia',
      connections: [],
    };
    addCodeBlock(newCodeBlockProps);
    setIsNaming(false);
  };

  
  const handleMouseUp = () => {
    if (isPlacing) {
      handleCodeBlockPlace();
    }
  };
  const handleCodeBlockPlace = () => {
    console.log("Placing code block with name:", blockName);
    
    setIsPlacing(false);
    setCodeContent("// Your code here");
    setBlockName("Untitledsss");
    setIsNaming(true);
  };

  useEffect(() => {
    if (stage) {
      stage.on("mousedown", handleMouseDown);
      stage.on("mouseup", handleMouseUp);

      return () => {
        stage.off("mousedown", handleMouseDown);
        stage.off("mouseup", handleMouseUp);
      };
    }
  }, [stage, scale, isPlacing, addCodeBlock]);

  return (
    <>
      {isPlacing && (
        <Group x={position.x} y={position.y}>
          <Rect
            width={300}
            height={170}
            fill="white"
            stroke="black"
            strokeWidth={1}
          />
          <Html>
            <div style={{ width: '300px', height: '170px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '5px', backgroundColor: '#f0f0f0' }}>
                {isNaming && (
                  <>
                    <input
                      type="text"
                      value={blockName}
                      onChange={handleNameChange}
                      style={{ flexGrow: 1, marginRight: '5px' }}
                    />
                    <button onClick={handleSaveName} style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '2px 5px', marginRight: '5px' }}>✓</button>
                  </>
                ) }
              </div>
              <CodeMirror
                value={codeContent}
                height="170px"
                theme={okaidia}
                extensions={[loadLanguage('python') || []]}
                onChange={handleCodeChange}
              />
            </div>
          </Html>
        </Group>
      )}
    </>
  );
}

export default CodeBlockTool;
