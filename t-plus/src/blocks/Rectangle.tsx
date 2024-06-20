import { Rect } from "react-konva";
import { IRectangle } from "@/interface";

interface IRectangleProps {
  block: IRectangle;
}

const Rectangle = ({ block }: IRectangleProps) => {
  const lineDash = block.dash === "line-dashed" ? [10, 5] : [];

  return (
    <Rect
      x={block.x + block.width / 2}
      y={block.y + block.height / 2}
      offsetX={block.width / 2}
      offsetY={block.height / 2}
      width={block.width}
      height={block.height}
      fill={block.fill}
      strokeWidth={block.strokeWidth}
      rotation={block.rotate}
      stroke={block.dash === "line-dashed" ? "white" : block.stroke}
      dash={lineDash}
    />
  );
};

export default Rectangle;
