import { useRef, useEffect } from "react";
import { RegularPolygon, Group } from "react-konva";
import Repair from "../shared/assets/icons/repair.svg";
import { ITwvlvValve } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";

const CLOSED_COLOR: string = "#6bf36b";
const OPENED_COLOR: string = "#ff1f1f";
const MIDDLE_COLOR: string = "#ffe11e";

const TWVLV_Status_Left: string = "TWVLV_Status_Left";
const TWVLV_Status_Right: string = "TWVLV_Status_Right";
const TWVLV_Status_Top: string = "TWVLV_Status_Top";

const vertical: string = "VERTICAL";
const verticalReverse: string = "VERTICAL_REVERSE";

interface TwvlvValveProps {
  block: ITwvlvValve;
}

const TwvlvValve = ({ block }: TwvlvValveProps) => {
  const imageRef = useRef<HTMLImageElement>(new Image());

  useEffect(() => {
    imageRef.current.src = Repair;
  }, []);

  const TWVLV_Status_Left_Value = getSampleValue(block.samples, TWVLV_Status_Left);
  const TWVLV_Status_Right_Value = getSampleValue(block.samples, TWVLV_Status_Right);
  const TWVLV_Status_Top_Value = getSampleValue(block.samples, TWVLV_Status_Top);

  let leftTriangleColor: string;
  let rightTriangleColor: string;
  let topTriangleColor: string;

  const isLeftOpened = TWVLV_Status_Left_Value >= 0.99;
  const isRightOpened = TWVLV_Status_Right_Value >= 0.99;
  const isTopOpened = TWVLV_Status_Top_Value >= 0.99;

  const isLeftMiddle = TWVLV_Status_Left_Value > 0.01 && TWVLV_Status_Left_Value < 0.99;
  const isRightMiddle = TWVLV_Status_Right_Value > 0.01 && TWVLV_Status_Right_Value < 0.99;
  const isTopMiddle = TWVLV_Status_Top_Value > 0.01 && TWVLV_Status_Top_Value < 0.99;

  leftTriangleColor = isLeftMiddle ? MIDDLE_COLOR : isLeftOpened ? OPENED_COLOR : CLOSED_COLOR;
  rightTriangleColor = isRightMiddle ? MIDDLE_COLOR : isRightOpened ? OPENED_COLOR : CLOSED_COLOR;
  topTriangleColor = isTopMiddle ? MIDDLE_COLOR : isTopOpened ? OPENED_COLOR : CLOSED_COLOR;

  if (block.rotate === "HORIZONTAL_REVERSE") {
    [leftTriangleColor, rightTriangleColor] = [rightTriangleColor, leftTriangleColor];
  }

  let rotation: number = 0;
  let offsetX: number = 0;
  let offsetY: number = 0;

  if (block.rotate === vertical) {
    rotation = 90;
    offsetX = 2;
    offsetY = -block.prefWidth / 2.2;
  } else if (block.rotate === verticalReverse) {
    rotation = 270;
    offsetX = -block.prefHeight / 1.8;
    offsetY = block.prefWidth / 18.5;
  } else {
    rotation = 0;
    offsetX = -block.prefWidth / 1.33;
    offsetY = block.scaleY === -1 ? -block.prefWidth / 4 : -block.prefWidth / 2;
  }

  return (
    <Group x={block.x} y={block.y} rotation={rotation} offsetX={offsetX} offsetY={offsetY}>
      <RegularPolygon
        sides={3}
        radius={block.prefWidth / 3.33}
        fill={leftTriangleColor}
        offsetX={0}
        offsetY={-block.prefWidth / 1.81}
        rotation={90}
        stroke="black"
        strokeWidth={1}
      />
      <RegularPolygon
        sides={3}
        radius={block.prefWidth / 3.33}
        fill={rightTriangleColor}
        offsetX={0}
        rotation={270}
        stroke="black"
        strokeWidth={1}
      />

      <RegularPolygon
        sides={3}
        radius={block.prefWidth / 3.33}
        fill={topTriangleColor}
        offsetX={block.scaleY !== -1 ? -block.prefWidth / 4 : block.prefWidth / 4}
        offsetY={-block.prefWidth / 3.33}
        rotation={block.scaleY !== -1 ? 180 : 0}
        stroke="black"
        strokeWidth={1}
      />
    </Group>
  );
};

export default TwvlvValve;
