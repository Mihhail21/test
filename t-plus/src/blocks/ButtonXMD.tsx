import { Group, Rect, Text } from "react-konva";
import { IButtonXMD } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";

const XMD_Status: string = "XMD_Status";

interface IButtonXMDProps {
  block: IButtonXMD;
}

const ButtonXMD = ({ block }: IButtonXMDProps) => {
  const firstfillColor = `rgb(${block.red * 255}, ${block.green * 255}, ${block.blue * 255})`;
  const secondfillColor = `rgb(${block.red2 * 255}, ${block.green2 * 255}, ${block.blue2 * 255})`;

  const statusValue = getSampleValue(block.samples, XMD_Status);

  let buttonText: string;
  let colorButton: string;

  if (statusValue === 0) {
    buttonText = block.buttonOnText;
    colorButton = firstfillColor;
  } else {
    buttonText = block.buttonOffText;
    colorButton = secondfillColor;
  }

  return (
    <Group x={block.x} y={block.y}>
      <Rect
        width={block.width}
        height={block.height}
        fill={colorButton}
        cornerRadius={5}
        stroke="white"
        strokeWidth={1}
      />
      <Text
        text={buttonText}
        align="center"
        fill="black"
        fontSize={12}
        fontFamily="Tahoma"
        wrap="word"
        width={block.width}
        verticalAlign="middle"
        height={block.height}
      />
    </Group>
  );
};

export default ButtonXMD;
