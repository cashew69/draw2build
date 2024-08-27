import React, { useState, useEffect } from "react";
import { Rect, Group } from 'react-konva';
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
  const stage = stageRef.current;
  const scale = stageRef.current?.scaleX() || 1;

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();

    if (pos && !isPlacing) {
      setPosition({
        x: (pos.x - (stage?.x() || 0)) / scale,
        y: (pos.y - (stage?.y() || 0)) / scale,
      });
      setIsPlacing(true);
    }
  };

  const handleMouseUp = () => {
    if (isPlacing) {
      handleCodeBlockPlace();
    }
  };

  const handleCodeChange = (value: string) => {
    setCodeContent(value);
    console.log("Code Changing");
  };

  const handleCodeBlockPlace = () => {
    const newCodeBlockProps: CustomCodeBlock = {
      uid: '', // This will be set in Canvas component
      x: position.x,
      y: position.y,
      width: 300,
      height: 150,
      content: codeContent,
      language: 'python',
      theme: 'okaidia',
      element: '',
    };
    addCodeBlock(newCodeBlockProps);
    setIsPlacing(false);
    setCodeContent("// Your code here");
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
            height={150}
            fill="white"
            stroke="black"
            strokeWidth={1}
          />
          <Html>
            <div style={{ width: '300px', height: '150px', overflow: 'hidden' }}>
              <CodeMirror
                value={codeContent}
                height="150px"
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