// handlemouse.tsx

import React, { useState, useRef, useEffect } from "react";
import { Rect } from "react-konva";
import Konva from "konva";

interface SelectionBoxProps {
  stageRef: React.RefObject<Konva.Stage>;
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ stageRef }) => {
  const isSelecting = useRef(false);
  const stage = stageRef.current;
  const scale = stageRef.current?.scaleX();
  const [selectionBox, setSelectionBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setSelectionBox({
        x: (pos.x - stage?.x()) / scale,
        y: (pos.y - stage?.y()) / scale,
        width: 0,
        height: 0,
      });
      isSelecting.current = true;
    }
  };
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isSelecting.current) return;

    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setSelectionBox((prevBox) => ({
        ...prevBox,
        width: (pos.x - stage?.x()) / scale - prevBox.x,
        height: (pos.y - stage?.y()) / scale - prevBox.y,
      }));
    }
  };

  const handleMouseUp = () => {
    isSelecting.current = false;
    setSelectionBox({ x: 0, y: 0, width: 0, height: 0 });
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      stage.on("mousedown", handleMouseDown);
      stage.on("mousemove", handleMouseMove);
      stage.on("mouseup", handleMouseUp);

      return () => {
        stage.off("mousedown", handleMouseDown);
        stage.off("mousemove", handleMouseMove);
        stage.off("mouseup", handleMouseUp);
      };
    }
  }, [selectionBox, scale]);

  return (
    <>
      {isSelecting.current && (
        <Rect
          x={selectionBox.x}
          y={selectionBox.y}
          width={selectionBox.width}
          height={selectionBox.height}
          fill="rgba(0, 162, 255, 0.25)"
          stroke="blue"
          strokeWidth={1}
        />
      )}
    </>
  );
};

export default SelectionBox;
