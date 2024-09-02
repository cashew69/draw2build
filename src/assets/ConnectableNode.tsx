import React, { useState, useRef, useEffect } from 'react';
import { Group, Rect, Circle, Line } from 'react-konva';
import Konva from 'konva';

interface ConnectableNodeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  onConnect: (fromId: string, toId: string) => void;
}

const ConnectableNode: React.FC<ConnectableNodeProps> = ({ id, x, y, width, height, fill, onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionLine, setConnectionLine] = useState<{ x: number; y: number } | null>(null);
  const nodeRef = useRef<Konva.Group>(null);

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    setIsConnecting(true);
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setConnectionLine({ x: pos.x, y: pos.y });
    }
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (isConnecting) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        setConnectionLine({ x: pos.x, y: pos.y });
      }
    }
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setIsConnecting(false);
    setConnectionLine(null);

    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (pos && stage) {
      const targetNode = stage.getIntersection(pos);
      if (targetNode) {
        const parentNode = targetNode.getParent();
        if (parentNode && parentNode.attrs.id && parentNode.attrs.id !== id) {
          onConnect(id, parentNode.attrs.id);
        }
      }
    }
  };

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      node.on('dragmove', handleDragMove);
    }
    return () => {
      if (node) {
        node.off('dragmove');
      }
    };
  }, [isConnecting]);

  return (
    <Group
      x={x}
      y={y}
      ref={nodeRef}
      draggable
      id={id}
    >
      <Rect
        width={width}
        height={height}
        fill={fill}
        cornerRadius={5}
      />
      <Circle
        x={0}
        y={height / 2}
        radius={5}
        fill="black"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        draggable
      />
      {connectionLine && (
        <Line
          points={[0, height / 2, connectionLine.x - x, connectionLine.y - y]}
          stroke="black"
          strokeWidth={2}
        />
      )}
    </Group>
  );
};

export default ConnectableNode;
