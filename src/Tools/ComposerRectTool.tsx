import React, { useState, useEffect, KeyboardEvent, useRef } from "react";
import { Rect, Group } from "react-konva";
import { Html } from "react-konva-utils";
import Konva from "konva";
import { useShapesContext } from "../Contexts/ShapesContext";
function ComposerRectTool({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage>;
}) {
  const { addRectangle,} = useShapesContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawComplete, setIsDrawComplete] = useState(false);
  const stage = stageRef.current;
  const scale = stageRef.current?.scaleX() || 1;
  const stagePos = stageRef.current?.position();
  const [dimensions, setDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const optionsRef = useRef<HTMLDivElement>(null);

  const options = ['rectangle', 'codeblock', 'textbox'];
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setIsDrawComplete(false);
    setIsDrawing(true);
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos && stagePos) {
      setDimensions({
        x: (pos.x - stagePos.x) / scale,
        y: (pos.y - stagePos.y) / scale,
        width: 0,
        height: 0,
      });
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos && stagePos) {
      setDimensions({
        ...dimensions,
        width: (pos.x - stagePos.x) / scale - dimensions.x,
        height: (pos.y - stagePos.y) / scale - dimensions.y,
      });
    }
  };

  const handleMouseUp = () => {
    console.log(dimensions);
    setIsDrawing(false);
    setIsDrawComplete(true);
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Selected text:', searchTerm);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setHoveredIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHoveredIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Tab') {
      e.preventDefault(); // Prevent default tab behavior
      if (filteredOptions.length > 0) {
        const topOption = filteredOptions[0];
        setSearchTerm(topOption);
        setHoveredIndex(-1);
      }
    } else if (e.key === 'Enter' && isDrawComplete) {
      handleDrawShape();
      console.log('Selected text:', searchTerm);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSearchTerm(option);
    setSelectedOption(option);
    setHoveredIndex(-1);
  };

  const handleDrawShape = () => {
    if (isDrawComplete && selectedOption) {
      switch (selectedOption) {
        case 'rectangle':
          addRectangle({
            x: dimensions.x,
            y: dimensions.y,
            width: dimensions.width,
            height: dimensions.height,
            fill: 'transparent',
            stroke: 'black',
            strokeWidth: 2,
          });
          break;
        case 'codeblock':
            
        break;
        default:
          console.log(`Shape type '${selectedOption}' not implemented`);
      }
      setIsDrawComplete(false);
      setSelectedOption('');
      setSearchTerm('');
    }
  };
  useEffect(() => {
    if (stage) {
      stage.on("mousedown", handleMouseDown);
      stage.on("mousemove", handleMouseMove);
      stage.on("mouseup", handleMouseUp);
    }
    return () => {
      if (stage) {
        stage.off("mousedown", handleMouseDown);
        stage.off("mousemove", handleMouseMove);
        stage.off("mouseup", handleMouseUp);
      }
    };
  }, [stage, isDrawing, dimensions, scale]);

  useEffect(() => {
    if (hoveredIndex !== -1 && optionsRef.current) {
      const optionElement = optionsRef.current.children[hoveredIndex] as HTMLElement;
      optionElement.scrollIntoView({ block: 'nearest' });
    }
  }, [hoveredIndex]);

  return (
    <>
    {isDrawing && (
        <Rect
          {...dimensions}
          fill="rgba(96, 30, 255, 0.1)"
          stroke="blue"
          strokeWidth={1}
        />
      )}
      {isDrawComplete && (
        <Group>
        <Rect
          {...dimensions}
          fill="rgba(96, 255, 30, 0.1)"
          stroke="blue"
          strokeWidth={2}
          dash={[10, 5]}
        />
        <Html>
          <div
            style={{
              position: 'absolute',
              left: `${dimensions.x}px`,
              top: `${dimensions.y + 10}px`,
              width: `${dimensions.width}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: '90%',
                height: '30px',
                padding: '5px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
            <div
              ref={optionsRef}
              style={{
                width: '90%',
                marginTop: '10px',
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: 'white'
              }}
            >
              {filteredOptions.map((option, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    backgroundColor: index === hoveredIndex ? '#f0f0f0' : 'white',
                  }}
                  onClick={() => handleOptionSelect(option)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                >
                  {option === 'rectangle' && '🔲 Rectangle'}
                  {option === 'codeblock' && '💻 CodeBlock'}
                  {option === 'textbox' && '📝 TextBox'}
                </div>
              ))}
            </div>
          </div>
        </Html>
        </Group>
      )}
      
    </>
  );
}

export default ComposerRectTool;
