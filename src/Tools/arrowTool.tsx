// ArrowTool.tsx
import React, { useState, useEffect } from "react";
import { Arrow } from "react-konva";
import { CustomArrow } from "./types";
import Konva from "konva";

function ArrowTool({
  stageRef,
  addArrow,
}: {
  stageRef: React.RefObject<Konva.Stage>;
  addArrow: (arrow: CustomArrow) => void;
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [newArrow, setNewArrow] = useState<CustomArrow>({ points: [] });
  const stage = stageRef.current;
  const scale = stageRef.current?.scaleX();

  const handleMouseDown = (_: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setNewArrow({
        points: [
          (pos.x - (stage?.x() ?? 0)) / (scale ?? 1),
          (pos.y - (stage?.y() ?? 0)) / (scale ?? 1),
          (pos.x - (stage?.x() ?? 0)) / (scale ?? 1),
          (pos.y - (stage?.y() ?? 0)) / (scale ?? 1),
        ],
      });
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (_: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setNewArrow((prevArrow) => ({
        points: [
          prevArrow.points[0],
          prevArrow.points[1],
          (pos.x - (stage?.x() ?? 0)) / (scale ?? 1),
          (pos.y - (stage?.y() ?? 0)) / (scale ?? 1),
        ],
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (newArrow.points.length > 0) addArrow(newArrow);
    setNewArrow({ points: [] });
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
  }, [isDrawing, newArrow, addArrow]);

  return (
    <>
      {isDrawing && <Arrow points={newArrow.points} stroke="black" draggable />}
    </>
  );
}

export default ArrowTool;
