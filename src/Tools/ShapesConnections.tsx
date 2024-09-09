import React, { useMemo } from 'react';
import { Arrow, Group} from 'react-konva';
import { useShapesContext } from '../Contexts/ShapesContext';
import { CustomRect, CustomLine, CustomArrow, CustomText, CustomCodeBlock } from '../types';

const ShapeConnections: React.FC = () => {
  const { rectangles, lines, arrows, texts, codeBlocks } = useShapesContext();

  const allShapes = useMemo(() => {
    const shapes = [...rectangles, ...lines, ...arrows, ...texts, ...codeBlocks];
    console.log('All shapes:', shapes);
    return shapes;
  }, [rectangles, lines, arrows, texts, codeBlocks]);

  const connections = useMemo(() => {
    return allShapes.flatMap(shape => {
      if (!shape.connections || shape.connections.length === 0) {
        console.log('Shape without connections:', shape);
        return [];
      }

      return shape.connections.map(connection => {
        const targetShape = allShapes.find(s => s.uid === connection);
        if (!targetShape) {
          console.log('Target shape not found:', connection);
          return null;
        }

        console.log('Creating connection:', shape, targetShape);

        const startX = getShapeCenter(shape).x;
        const startY = getShapeCenter(shape).y;
        const endX = getShapeCenter(targetShape).x;
        const endY = getShapeCenter(targetShape).y;

        return (
          <Arrow
            key={`${shape.uid}-${connection}`}
            points={[startX, startY, (startX + endX) / 2, startY, (startX + endX) / 2, endY, endX, endY]}
            bezier
            fill="black"
            stroke="black"
            strokeWidth={2}
          />
        );
      }).filter(connection => connection !== null);
    });
  }, [allShapes]);

  console.log('Rendered connections:', connections);

  return <Group>{connections}</Group>;
};

const getShapeCenter = (shape: CustomRect | CustomLine | CustomArrow | CustomText | CustomCodeBlock) => {
  if ('x' in shape && 'y' in shape && 'width' in shape && 'height' in shape) {
    return {
      x: shape.x + (shape.width ?? 0) / 2,
      y: shape.y + (shape.height ?? 0) / 2
    };
  } else if ('points' in shape) {
    const points = shape.points;
    return {
      x: (points[0] + points[2]) / 2,
      y: (points[1] + points[3]) / 2
    };
  } else {
    return { x: shape.x, y: shape.y };
  }
};

export default ShapeConnections;
