import { Group, Rect, Text } from "react-konva";
import { ITablo } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";

interface ITabloProps {
  block: ITablo;
}
const defaultFirstColor = "#69e169";
const defaultSecondColor = "#ffe11e";
const defaultThirdColor = "#ff1e1e";
const TABLO_Status = "TABLO_Status";

const Tablo = ({ block }: ITabloProps) => {
  const firstfillColor =
    block.red === 0 && block.green === 0 && block.blue === 0
      ? defaultFirstColor
      : `rgb(${block.red * 255}, ${block.green * 255}, ${block.blue * 255})`;
  const secondfillColor =
    block.red2 === 0 && block.green2 === 0 && block.blue2 === 0
      ? defaultSecondColor
      : `rgb(${block.red2 * 255}, ${block.green2 * 255}, ${block.blue2 * 255})`;
  const thirdfillColor =
    block.red3 === 0 && block.green3 === 0 && block.blue3 === 0
      ? defaultThirdColor
      : `rgb(${block.red3 * 255}, ${block.green3 * 255}, ${block.blue3 * 255})`;

  const statusValue = getSampleValue(block.samples, TABLO_Status);

  let buttonColor: string = "black";
  let text: string = "";
  if (statusValue === 0) {
    buttonColor = firstfillColor;
    text = block.firstStatus;
  } else if (statusValue === 1) {
    buttonColor = secondfillColor;
    text = block.secondStatus;
  } else if (statusValue === 2) {
    buttonColor = thirdfillColor;
    text = block.thirdStatus;
  }

  return (
    <Group x={block.x} y={block.y}>
      <Rect
        width={block.width}
        height={block.height}
        fill={buttonColor}
        cornerRadius={5}
        stroke="black"
        strokeWidth={1}
      />
      <Text
        text={text}
        fill="black"
        fontSize={block.fontSize}
        fontFamily={block.fontName}
        fontStyle={block.fontWeight}
        align={block.textAlignment}
        wrap="word"
        width={block.width}
        verticalAlign="middle"
        height={block.height}
        lineHeight={1}
      />
    </Group>
  );
};

export default Tablo;
