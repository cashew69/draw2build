import React, { useState, useEffect } from "react";
import { Rect } from "react-konva";
import Konva from "konva";
import { CustomRect } from "./types";

function RectTool({
  stageRef,
  addRectangle,
}: {
  stageRef: React.RefObject<Konva.Stage>;
  addRectangle: (rect: CustomRect) => void;
}) {
  //const [rectangles, setRectangles] = useState<CustomRect[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const stage = stageRef.current;
  const [newRect, setNewRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    draggable: true,
  });

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setNewRect({
        x: pos.x - stage?.x(),
        y: pos.y - stage?.y(),
        width: 0,
        height: 0,
        draggable: true,
      });
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setNewRect((prevRect) => ({
        ...prevRect,
        width: pos.x - stage?.x() - prevRect.x,
        height: pos.y - stage?.y() - prevRect.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    /*setRectangles((prevRects) => [...prevRects, newRect]);
    console.log(rectangles);*/
    if (newRect) addRectangle(newRect);
    setNewRect(null);
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
  }, [isDrawing, newRect, addRectangle]);

  return (
    <>{isDrawing && <Rect {...newRect} fill="transparent" stroke="black" />}</>
  );
}

export default RectTool;
