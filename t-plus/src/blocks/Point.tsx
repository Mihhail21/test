import { useState } from "react";
import { Circle } from "react-konva";
import { IPoint } from "../interface";
import { KonvaEventObject } from "konva/lib/Node";

interface IPointProps {
  block: IPoint;
}

const Point = ({ block }: IPointProps) => {
  const [position, setPosition] = useState(block);
  const handleGroupDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const group = e.target;
    const newPosition = {
      ...position,
      x: group.x(),
      y: group.y(),
    };
    setPosition(newPosition);
  };

  return (
    <Circle
      draggable={true}
      onDragEnd={handleGroupDragEnd}
      x={position.x}
      y={position.y}
      radius={block.radius}
      fill={block.fill}
      stroke={block.stroke}
      strokeWidth={block.strokeWidth ? block.strokeWidth : 1}
      scaleX={block.scaleX ? block.scaleX : 1}
      scaleY={block.scaleY ? block.scaleY : 1}
    />
  );
};

export default Point;
