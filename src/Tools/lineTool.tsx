// LineTool.tsx
import React, { useState, useEffect } from "react";
import { Line } from "react-konva";
import { CustomLine } from "../types";
import Konva from "konva";

function LineTool({
  stageRef,
  addLine,
}: {
  stageRef: React.RefObject<Konva.Stage>;
  addLine: (line: CustomLine) => void;
}) {
  const stage = stageRef.current;
  const scale = stageRef.current?.scaleX();
  const [lines, setLines] = useState<CustomLine[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newLine, setNewLine] = useState<CustomLine>({
    points: [],
    draggable: true,
  });

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setNewLine({
        points: [(pos.x - stage?.x()) / scale, (pos.y - stage?.y()) / scale],
        draggable: true,
      });
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setNewLine((prevLine) => ({
        points: [
          ...prevLine.points,
          (pos.x - stage?.x()) / scale,
          (pos.y - stage?.y()) / scale,
        ],
        draggable: true,
      }));
    }
  };

  const handleMouseUp = () => {
    //setIsDrawing(false);
    //setLines((prevLines) => [...prevLines, newLine]);
    setIsDrawing(false);
    if (newLine) addLine(newLine);
    setNewLine(null);
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
  }, [isDrawing, newLine, addLine]);

  return (
    <>
      {lines.map((line, i) => (
        <Line key={i} points={line.points} stroke="black" />
      ))}
      {isDrawing && <Line points={newLine.points} stroke="black" />}
    </>
  );
}

export default LineTool;
