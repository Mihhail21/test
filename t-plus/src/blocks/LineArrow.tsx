import { Arrow } from "react-konva";
import { ILineArrow } from "../interface";
interface ILineArrowProps {
  block: ILineArrow;
}
const LineArrow = ({ block }: ILineArrowProps) => {
  const fillColor = `rgb(${block.red * 255}, ${block.green * 255}, ${block.blue * 255})`;

  let rotation: number;
  switch (block.rotate) {
    case "VERTICAL_REVERSE":
      rotation = 270;
      break;
    case "VERTICAL":
      rotation = 90;
      break;
    case "HORIZONTAL":
      rotation = 0;
      break;
    case "HORIZONTAL_REVERSE":
      rotation = 180;
      break;
    default:
      rotation = 0;
  }

  return (
    <Arrow
      x={block.x + block.height / 2}
      y={block.y + block.height / 2}
      points={[0, 0, 5, 0]}
      pointerLength={block.height}
      pointerWidth={block.height - 2}
      fill={fillColor}
      stroke={fillColor}
      strokeWidth={0}
      rotation={rotation}
    />
  );
};
export default LineArrow;
