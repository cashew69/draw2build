import React, { useState, useEffect, useRef } from "react";
import { Group } from "react-konva";
import { Html } from "react-konva-utils";
import { useShapesContext } from "../Contexts/ShapesContext";
import { useSelectionContext } from "../Contexts/SelectionContext";

export function SetElement({ onElementSet }: { onElementSet: () => void }) {
  const [textValue, setTextValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateShapeConnections } = useShapesContext();
  const { selectedShape } = useSelectionContext();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && textValue.trim() !== "") {
      if (selectedShape) {
        const [action, uid] = textValue.split(":");
        if (action === "add" || action === "delete") {
          updateShapeConnections(selectedShape, action, uid);
        }
        onElementSet(); // Pass the textValue to onElementSet
        setTextValue(""); // Clear input after adding
      }
    }
  };

  return (
    <Group x={50} y={10}>
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
  );
}
