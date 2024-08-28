import Konva from 'konva';

interface ZoomHandlerProps {
  setStageScale: React.Dispatch<React.SetStateAction<number>>;
  setStagePos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

export const createZoomHandler = ({ setStageScale, setStagePos }: ZoomHandlerProps) => {
  return (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const mousePointTo = {
      x: pointerPosition.x / oldScale - stage.x() / oldScale,
      y: pointerPosition.y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageScale(newScale);
    if (pointerPosition) {
      const newPos = {
        x: -(mousePointTo.x - pointerPosition.x / newScale) * newScale,
        y: -(mousePointTo.y - pointerPosition.y / newScale) * newScale,
      };
      setStagePos(newPos);
    }
  };
};
