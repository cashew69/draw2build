import React, { useState, useEffect } from "react";
import { Rect, Text } from 'react-konva';
import { CustomTemplate } from '../types';
import Konva from 'konva';



function TemplateTool({ stageRef, addTemplate }: {stageRef: React.RefObject<Konva.Stage>; addTemplate: (template: CustomTemplate) => void;}) {
  const [Position, setPos] = useState({ x: 0, y: 0 });
  const [Clicked, setClick] = useState(0);
  const stage = stageRef.current;
  const scale = stageRef.current?.scaleX();



  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();

    if (pos) {
      setPos({
        x: (pos.x - stage?.x()) / scale,
        y: (pos.y - stage?.y()) / scale,
      });
      //setisEditing(1);
    }
    setClick(1)
  };

  useEffect(() => {
    

    if (stage) {
      stage.on("mousedown", handleMouseDown);

      return () => {
        stage.off("mousedown", handleMouseDown);
      };
    }
  }, [Clicked]);

  return (
    <>
    {Clicked === 1 && (
    <div>
          <Rect
            x={Position.x}
            y={Position.y}
            width={100}
            height={50}
            fill="lightblue"
            stroke="black"
            strokeWidth={1}
          />
          <Text
            x={Position.x + 5}
            y={Position.y + 15}
            text="Template"
            fontSize={16}
            fill="black"
          />
    </div>
  )}</>
  );
};

export default TemplateTool;
