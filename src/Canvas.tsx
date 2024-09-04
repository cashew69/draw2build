import { useEffect, useRef} from "react";
import {
  Stage,
  Layer,
  Rect,
  Line,
  Text,
  Arrow,
  Transformer,
  Group,
} from "react-konva";
import SelectionBox from "./selectionbox"; // For selection tool
import Konva from "konva";
import RectTool from "./rectTool"; // For drawing rectangles
import LineTool from "./lineTool"; // For drawing lines
import ArrowTool from "./arrowTool"; // For drawing arrows
import { SetElement } from "./setElement"; // For adding text
import { TextBox } from "./TextBox";
import CodeBlockTool from "./codeBlockTool";
import { Html } from "react-konva-utils";
import CodeMirror from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { loadLanguage, LanguageName } from '@uiw/codemirror-extensions-langs';
import { useToolContext } from "./Contexts/ToolContext";
import { useShapesContext } from "./Contexts/ShapesContext";
import { InfiniteCanvas } from "./utils/InfiniteCanvas";
import { createZoomHandler } from './utils/ZoomHandler';
import { ShortId } from './utils/ShortId';
import { useStageContext } from './Contexts/StageContext';
import { useSelectionContext } from './Contexts/SelectionContext';
import { useCanvasEventHandlers } from "./utils/CanvasEventHandlers";
import { handleCodeBlockTransform, codeBlockTransformerConfig } from './utils/CodeBlock_utils/CodeBlockTransformHandler';
import ShapeConnections from './ShapesConnections';
import { useState } from "react";
import { useCodeBlockNameHandler } from './utils/CodeBlock_utils/CodeBlockNameHandler';
import { useCodeBlockMap } from './Contexts/filename-uid'; // Add this import

// Main Canvas component where the drawing happens
function Canvas() {
  const { rectangles, lines, arrows, texts, codeBlocks, addRectangle, addLine, addArrow, addText, addCodeBlock, updateRectPosition, updateLinePosition, updateArrowPosition, updateTextPosition, updateCodeBlockPosition, updateCodeContent, updateCodeBlockDimensions, updateCodeBlockName} = useShapesContext();
 // Tool Context.
  const { tool } = useToolContext();
  // Stage Context.
  const { stagePos, setStagePos, stageScale, setStageScale, stageDrag} = useStageContext();
  const { selectedShape, setSelectedShape, isEditingElement, selectedCodeBlock, codeBlockTransformerRef } = useSelectionContext();
  const { setCodeBlock } = useCodeBlockMap(); // Add this line

  const stageRef = useRef<Konva.Stage>(null);
  const { handleKeyDown, handleKeyUp, handleElementSet, handleSelect, handleCodeBlockSelect } = useCanvasEventHandlers();
  const transformerRef = useRef<Konva.Transformer>(null);
  const [renamingCodeBlock, setRenamingCodeBlock] = useState<string | null>(null);
  const [tempName, setTempName] = useState<string>("");

  // Add event listener for keydown on mount and remove on unmount
  useEffect(() => {
    console.log("Adding keydown event listener");
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      console.log("Removing keydown event listener");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Update transformer when selected shape changes
  useEffect(() => {
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      if (selectedShape) {
        const selectedNode = stageRef.current?.findOne(`#${selectedShape}`);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer()?.batchDraw();
        }
      }
    }
  }, [selectedShape]);

  useEffect(() => {
    if (codeBlockTransformerRef.current) {
      codeBlockTransformerRef.current.nodes([]);
      if (selectedCodeBlock) {
        const selectedNode = stageRef.current?.findOne(`#${selectedCodeBlock}`);
        if (selectedNode) {
          codeBlockTransformerRef.current.nodes([selectedNode]);
          codeBlockTransformerRef.current.getLayer()?.batchDraw();
        }
      }
    }
  }, [selectedCodeBlock]);

  const handleCodeBlockTransformWrapper = (index: number, e: Konva.KonvaEventObject<Event>) => {
    handleCodeBlockTransform(index, e, codeBlocks, updateCodeBlockPosition, updateCodeBlockDimensions);
  };

  // Function to get theme object from string
  const getThemeObject = (themeName: string) => {
    switch (themeName) {
      case 'okaidia':
        return okaidia;
      // Add more cases for other themes as needed
      default:
        return okaidia;
    }
  };

  return (
    <div>
      <Stage
        onWheel={createZoomHandler({ setStageScale, setStagePos })}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={stageDrag}
        onDragEnd={(e) => {
          setStagePos(e.currentTarget.position());
        }}
        ref={stageRef}
        onMouseDown={(e) => {
          if (e.target === stageRef.current) {
            console.log("Clicked on empty canvas. Deselecting shape.");
            setSelectedShape(null);
          }
        }}
      >
        <Layer>
          {InfiniteCanvas({ stagePos })}

          {tool === "selection" && <SelectionBox stageRef={stageRef} />}
          {tool === "rect" && (
            <RectTool
              stageRef={stageRef}
              addRectangle={(rect) => {
                const newRect = { ...rect, uid: ShortId()}; // Assign UUID
                addRectangle(newRect);
              }}
            />
          )}
          {tool === "line" && (
            <LineTool
              stageRef={stageRef}
              addLine={(line) => {
                const newLine = { ...line, uid: ShortId()}; // Assign UUID
                addLine(newLine);
              }}
            />
          )}
          {tool === "arrow" && (
            <ArrowTool
              stageRef={stageRef}
              addArrow={(arrow) => {
                const newArrow = { ...arrow, uid: ShortId()}; // Assign UUID
                addArrow(newArrow);
              }}
            />
          )}
          {tool === "text" && (
            <TextBox
              stageRef={stageRef}
              addText={(text) => {
                const newText = { ...text, uid: ShortId()}; // Assign UUID
                addText(newText);
              }}
              />
            )}
            {tool === "CodeBlock" && (
              <CodeBlockTool
                stageRef={stageRef}
                addCodeBlock={(codeBlock) => {
                  const newCodeBlock = { ...codeBlock, uid: ShortId()};
                  addCodeBlock(newCodeBlock);
                  // Add this line to save the new CodeBlock in the context
                  setCodeBlock(newCodeBlock.name, newCodeBlock.uid);
                }}
            />
          )}

          {/* Rendering all rectangles */}
          {rectangles.map((rect, i) => (
            <Rect
              key={i}
              {...rect}
              id={`rect${i}`}
              fill="transparent"
              stroke="black"
              draggable
              className="selectable"
              onClick={(e) => handleSelect(e, `rect${i}`)}
              onDragEnd={(e) => {
                updateRectPosition(i, e.target.x(), e.target.y());
              }}
            />
          ))}
          {/* Rendering all lines */}
          {lines.map((line, i) => (
            <Line
              key={i}
              {...line}
              points={line.points}
              stroke="black"
              id={`line${i}`}
              draggable
              className="selectable"
              onClick={(e) => handleSelect(e, `line${i}`)}
              onDragEnd={(e) => {
                updateLinePosition(i, e.target.x(), e.target.y());
              }}
            />
          ))}
          {/* Rendering all arrows */}
          {arrows.map((arrow, i) => (
            <Arrow
              key={i}
              {...arrow}
              points={arrow.points}
              stroke="black"
              id={`arrow${i}`}
              draggable
              className="selectable"
              onClick={(e) => handleSelect(e, `arrow${i}`)}
              onDragEnd={(e) => {
                updateArrowPosition(i, e.target.x(), e.target.y());
              }}
            />
          ))}
          {texts.map((text, i) => (
            <Text
              key={i}
              {...text}
              x={text.x}
              y={text.y}
              text={text.text}
              width={text.width}
              height={text.height}
              fontSize={15}
              id={`text${i}`}
              draggable
              className="selectable"
              onClick={(e) => handleSelect(e, `text${i}`)}
              onDragEnd={(e) => {
                updateTextPosition(i, e.target.x(), e.target.y());
              }}
            />
          ))}
          {/* Rendering all code blocks */}
          {codeBlocks.map((codeBlock, i) => {
            const { handleRename, handleSaveName, handleNameChange } = useCodeBlockNameHandler({
              index: i,
              currentName: codeBlock.name,
              setRenamingCodeBlock,
              setTempName,
              updateCodeBlockName: (index, newName) => {
                updateCodeBlockName(index, newName);
                // Add this line to update the CodeBlock name in the context
                setCodeBlock(newName, codeBlock.uid);
              },
            });

            return (
              <Group
                key={i}
                x={codeBlock.x}
                y={codeBlock.y}
                width={codeBlock.width}
                height={codeBlock.height}
                id={`codeBlock${i}`}
                onClick={(e) => handleCodeBlockSelect(e, `codeBlock${i}`)}
                onDragEnd={(e) => {
                  updateCodeBlockPosition(i, e.target.x(), e.target.y());
                }}
                onTransform={(e) => handleCodeBlockTransformWrapper(i, e)}
                draggable
              >
                <Rect
                  width={codeBlock.width}
                  height={codeBlock.height}
                  fill="#ccc"
                  stroke="#ccc"
                  strokeWidth={39}
                  opacity={0}
                  onMouseEnter={(e) => {
                    const target = e.target as Konva.Shape;
                    target.opacity(0.3);
                    const stage = target.getStage();
                    if (stage) {
                      stage.container().style.cursor = 'move';
                    }
                    const layer = target.getLayer();
                    if (layer) {
                      layer.draw();
                    }
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as Konva.Shape;
                    target.opacity(0);
                    const stage = target.getStage();
                    if (stage) {
                      stage.container().style.cursor = 'default';
                    }
                    const layer = target.getLayer();
                    if (layer) {
                      layer.draw();
                    }
                  }}
                />
                <Html 
                divProps={{
                  style: {
                    width: `${codeBlock.width}px`,
                    height: `${codeBlock.height}px`,
                    overflow: 'hidden'
                  }
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                    <div style={{ padding: '5px', backgroundColor: 'rgba(240, 240, 240, 0)', borderBottom: '1px solid rgba(204, 204, 204, 0)', display: 'flex', alignItems: 'center'}}>
                      {renamingCodeBlock === `codeBlock${i}` ? (
                        <>
                          <input
                            type="text"
                            value={tempName}
                            onChange={handleNameChange}
                            style={{ flexGrow: 1, marginRight: '5px', backgroundColor: 'transparent' }}
                          />
                          <button 
                            onClick={handleSaveName} 
                            style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '2px 5px', marginRight: '5px' }}
                          >
                            ✓
                          </button>
                        </>
                      ) : (
                        <span 
                          onDoubleClick={() => handleRename()}
                          style={{ flexGrow: 1, color: 'rgba(0, 0, 0, 1)', fontWeight: 'bold'}}
                        >
                          {codeBlock.name}
                        </span>
                      )}
                    </div>
                    <CodeMirror
                      value={codeBlock.content}
                      height={`${codeBlock.height - 30}px`}
                      width={`${codeBlock.width}px`}
                      theme={getThemeObject(codeBlock.theme)}
                      extensions={[loadLanguage(codeBlock.language as LanguageName) || []]}
                      onChange={(value) => {
                        updateCodeContent(i, value);
                      }}
                      editable={!stageDrag && renamingCodeBlock !== `codeBlock${i}`}
                    />
                  </div>
                </Html>
              </Group>
            );
          })}
        
          {isEditingElement && <SetElement onElementSet={handleElementSet} />}
          {/* Transformer for resizing and rotating shapes */}
          <Transformer ref={transformerRef} ignoreStroke={true} />
          <Transformer ref={codeBlockTransformerRef} {...codeBlockTransformerConfig} />
          <ShapeConnections />
        </Layer>
      </Stage>
    </div>
  );
}

export default Canvas;