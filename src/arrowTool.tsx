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
  //const [arrows, setArrows] = useState<CustomArrow[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newArrow, setNewArrow] = useState<CustomArrow>({ points: [] });
  const stage = stageRef.current;
  const scale = stageRef.current?.scaleX();

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setNewArrow({
        points: [
          (pos.x - stage?.x()) / scale,
          (pos.y - stage?.y()) / scale,
          (pos.x - stage?.x()) / scale,
          (pos.y - stage?.y()) / scale,
        ],
      });
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setNewArrow((prevArrow) => ({
        points: [
          prevArrow.points[0],
          prevArrow.points[1],
          (pos.x - stage?.x()) / scale,
          (pos.y - stage?.y()) / scale,
        ],
      }));
    }
  };

  const handleMouseUp = () => {
    //setIsDrawing(false);
    //setArrows((prevArrows) => [...prevArrows, newArrow]);
    setIsDrawing(false);
    if (newArrow) addArrow(newArrow);
    setNewArrow(null);
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
