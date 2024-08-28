import { Rect } from 'react-konva';

interface GridConfig {
  stagePos: { x: number; y: number };
}

export function InfiniteCanvas({  stagePos }: GridConfig): JSX.Element[] {

  const WIDTH = 100;
  const HEIGHT = 100;

  const grid = [
    ["white", "white"],
    ["white", "white"],
  ];
  
  const startX = Math.floor((-stagePos.x - window.innerWidth) / WIDTH) * WIDTH;
  const endX = Math.floor((-stagePos.x + window.innerWidth * 2) / WIDTH) * WIDTH;
  const startY = Math.floor((-stagePos.y - window.innerHeight) / HEIGHT) * HEIGHT;
  const endY = Math.floor((-stagePos.y + window.innerHeight * 2) / HEIGHT) * HEIGHT;

  const gridComponents: JSX.Element[] = [];

 

  for (let x = startX; x < endX; x += WIDTH) {
    for (let y = startY; y < endY; y += HEIGHT) {
      const indexX = Math.abs(x / WIDTH) % grid.length;
      const indexY = Math.abs(y / HEIGHT) % grid[0].length;

      gridComponents.push(
        <Rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={WIDTH}
          height={HEIGHT}
          fill={grid[indexX][indexY]}
          stroke="black"
        />
      );
    }
  }

  return gridComponents;
}
