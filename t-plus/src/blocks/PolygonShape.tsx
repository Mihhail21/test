import { Line } from "react-konva";
import { IPolygonShape } from "@/interface/shapes/PolygonShape";
interface IPolygonShapeProps {
  block: IPolygonShape;
}
const PolygonShape = ({ block }: IPolygonShapeProps) => {
  return (
    <Line
      draggable={true}
      x={block.x}
      y={block.y}
      points={block.points}
      fill={block.fill}
      stroke={block.stroke}
      strokeWidth={block.strokeWidth}
      scaleX={block.scaleX}
      scaleY={block.scaleY}
      rotation={block.rotation}
      closed={true}
    />
  );
};
export default PolygonShape;
