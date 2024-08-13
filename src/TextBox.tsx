import React, { useState, useEffect, useRef } from "react";
import Konva from "konva";
import { Group, Text } from "react-konva";
import { Html } from "react-konva-utils";

export function TextBox({
  stageRef,
  addText,
}: {
  stageRef: React.RefObject<Konva.Stage>;
  addText: (text: { x: number; y: number; text: string }) => void;
}) {
  const [textValue, setTextValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setisEditing] = useState(0);
  const [Position, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();

    if (pos) {
      setPos({ x: pos.x, y: pos.y });
      setisEditing(1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && textValue.trim() !== "") {
      addText({ x: Position.x, y: Position.y, text: textValue });
      setisEditing(2);
    }
  };

  useEffect(() => {
    const stage = stageRef.current;

    if (stage) {
      stage.on("mousedown", handleMouseDown);

      return () => {
        stage.off("mousedown", handleMouseDown);
      };
    }
  }, [isEditing, addText, textValue]);

  return (
    <>
      {isEditing === 1 && (
        <Group x={Position.x} y={Position.y}>
          <Html>
            <input
              ref={inputRef}
              style={{
                position: "absolute",

                width: "100px",
                zIndex: 1000,
              }}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Html>
        </Group>
      )}
      {isEditing === 2 && (
        <Text
          x={Position.x}
          y={Position.y}
          text={textValue}
          fontSize={15}
          draggable
        />
      )}
    </>
  );
}
