import { FC } from "react";
import { Line } from "react-konva";
import { ILineMain } from "@/interface";

interface ILineMainProps {
  block: ILineMain;
}

const LineMain: FC<ILineMainProps> = ({ block }) => {
  const lineDash = block.dash === "line-dashed" ? [10, 5] : [];
  const angle = block.rotate || 0;
  const centerX = (block.x1 + block.x2) / 2;
  const centerY = (block.y1 + block.y2) / 2;
  const rotatePoint = (
    x: number,
    y: number,
    angle: number,
    centerX: number,
    centerY: number
  ) => {
    const radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = cos * (x - centerX) + sin * (y - centerY) + centerX,
      ny = cos * (y - centerY) - sin * (x - centerX) + centerY;
    return [nx, ny];
  };

  const [newX1, newY1] = rotatePoint(
    block.x1,
    block.y1,
    angle,
    centerX,
    centerY
  );
  const [newX2, newY2] = rotatePoint(
    block.x2,
    block.y2,
    angle,
    centerX,
    centerY
  );

  return (
    <Line
      points={[newX1, newY1, newX2, newY2]}
      lineCap="round"
      stroke={block.color}
      strokeWidth={block.strokeWidth}
      dash={lineDash}
    />
  );
};
export default LineMain;
