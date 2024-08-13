import React, { useState, useEffect, useRef } from "react";
import { Group } from "react-konva";
import { Html } from "react-konva-utils";

export let elementtext = "";

export function SetElement({ onElementSet }: { onElementSet: () => void }) {
  const [textValue, setTextValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && textValue.trim() !== "") {
      elementtext = textValue;
      onElementSet(); // Call the callback function to set the element text
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
