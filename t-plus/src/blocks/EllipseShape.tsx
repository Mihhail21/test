import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Ellipse } from "react-konva";
import { IEllipseShape } from "@/interface";

interface IEllipseShapeProps {
  block: IEllipseShape;
}

const EllipseShape = ({ block }: IEllipseShapeProps) => {
  
  const [position, setPosition] = useState(block);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const shape = e.target;
    const newPosition = {
      ...position,
      x: shape.x(),
      y: shape.y(),
    };
    setPosition(newPosition);
  };

  return (
    <Ellipse
      draggable={true}
      onDragEnd={handleDragEnd}
      x={position.x}
      y={position.y}
      radiusX={block.radiusX}
      radiusY={block.radiusY}
      fill={block.fill}
      stroke={block.stroke}
      strokeWidth={block.strokeWidth}
      rotation={block.rotate}
    />
  );
};

export default EllipseShape;
