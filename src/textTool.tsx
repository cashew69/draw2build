import React, { useState, useEffect } from "react";

import { Text } from "react-konva";

import { CustomText } from "./types";

import Konva from "konva";

function TextTool({
  stageRef,

  addText,
}: {
  stageRef: React.RefObject<Konva.Stage>;

  addText: (text: CustomText) => void;
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  const [newText, setNewText] = useState<CustomText | null>(null);

  const [textValue, setTextValue] = useState("");

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();

    if (pos) {
      setNewText({ x: pos.x, y: pos.y, text: "New Text" });

      setIsDrawing(true);
    }
  };

  const handleMouseUp = () => {
    //if (isDrawing) {

    // setTexts((prevTexts) => [...prevTexts, newText]);

    //setIsDrawing(false);

    if (newText) {
      addText(newText);
    }

    setIsDrawing(false);

    setNewText(null);
  };

  useEffect(() => {
    const stage = stageRef.current;

    if (stage) {
      stage.on("mousedown", handleMouseDown);

      stage.on("mouseup", handleMouseUp);

      return () => {
        stage.off("mousedown", handleMouseDown);

        stage.off("mouseup", handleMouseUp);
      };
    }
  }, [isDrawing, newText, addText, textValue]);

  return (
    <>
      {isDrawing && (
        <Text
          x={newText.x}
          y={newText.y}
          text={newText.text}
          fontSize={15}
          draggable
        />
      )}
    </>
  );
}

export default TextTool;
