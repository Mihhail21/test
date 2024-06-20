import { RegularPolygon, Group } from "react-konva";
import { IReverseValve } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";

const CLOSED_COLOR: string = "#6bf36b";
const OPENED_COLOR: string = "#ff1f1f";
const MIDDLE_POS_COLOR: string = "#FFE11EFF";
const CHV_Status: string = "CHV_Status";
const vertical: string = "VERTICAL";
const verticalReverse: string = "VERTICAL_REVERSE";
const horizontalReverse: string = "HORIZONTAL_REVERSE";

interface IReverseValveProps {
  block: IReverseValve;
}

const ReverseValve = ({ block }: IReverseValveProps) => {
  const CHV_Status_Value = getSampleValue(block.samples, CHV_Status);
  let rightTriangleColor: string;

  if (CHV_Status_Value > 0.1 && CHV_Status_Value <= 0.9) {
    rightTriangleColor = MIDDLE_POS_COLOR;
  } else if (CHV_Status_Value <= 0.1) {
    rightTriangleColor = CLOSED_COLOR;
  } else {
    rightTriangleColor = OPENED_COLOR;
  }

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

  let offsetX: number = 0;
  let offsetY: number = 0;

  switch (block.rotate) {
    case vertical:
      offsetX = -block.prefHeight / 4;
      offsetY = -block.prefWidth / 2.22;
      break;
    case verticalReverse:
      offsetX = -block.prefHeight;
      offsetY = block.prefWidth / 2.22;
      break;
    case horizontalReverse:
      offsetX = -block.prefHeight / 0.7;
      offsetY = -block.prefWidth / 4.5;
      break;
    default:
      offsetX = block.prefWidth / 5;
      offsetY = block.prefWidth / 4;
  }

  return (
    <Group
      x={block.x + block.prefWidth - block.prefWidth / 25}
      y={block.y + block.prefWidth / 2}
      rotation={rotation}
      offsetX={offsetX}
      offsetY={offsetY}
    >
      <RegularPolygon
        sides={3}
        radius={block.prefWidth / 4 + 2}
        fill="black"
        offsetX={0}
        offsetY={-block.prefWidth / 2 - 2}
        rotation={90}
        stroke="black"
        strokeWidth={1}
      />
      <RegularPolygon
        sides={3}
        radius={block.prefWidth / 4 + 2}
        fill={rightTriangleColor}
        offsetX={0}
        rotation={270}
        stroke="black"
        strokeWidth={1}
      />
    </Group>
  );
};

export default ReverseValve;
