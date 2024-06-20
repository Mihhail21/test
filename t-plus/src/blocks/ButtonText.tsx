import { useState } from "react";
import { Group, Rect, Text } from "react-konva";
import { useParams } from "react-router-dom";
import { IButtonText } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import useSendCommand from "@/shared/api/useSendCommand";

const BUTTON_Status: string = "TEXT_BUTTON_Status";
let buttonText: string;
let colorButton: string;

interface IButtonTextProps {
  block: IButtonText;
}

const ButtonText = ({ block }: IButtonTextProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const { sendCommand } = useSendCommand(stationCode || "");
  const [isHover, setIsHover] = useState(false);
  const firstfillColor = `rgb(${block.red * 255}, ${block.green * 255}, ${block.blue * 255})`;
  const secondfillColor = `rgb(${block.red2 * 255}, ${block.green2 * 255}, ${block.blue2 * 255})`;

  const statusValue = getSampleValue(block.samples, BUTTON_Status);

  if (statusValue === 0) {
    buttonText = block.buttonOnText;
    colorButton = firstfillColor;
  } else {
    buttonText = block.buttonOffText;
    colorButton = secondfillColor;
  }

  const changeCursorOnHover = (isPoiner: boolean) => {
    setIsHover(isPoiner);
    document.body.style.cursor = isPoiner ? "pointer" : "default";
  };

  const toggleSwitch = async () => {
    const value = statusValue === 0 ? 1 : 0;
    const command = { name: block.kks, value: value };
    try {
      await sendCommand(command);
    } catch (error) {
      console.error("Ошибка при отправке команды переключения положения:", error);
    }
  };

  return (
    <Group
      x={block.x - 4}
      y={block.y - 1}
      onMouseEnter={() => changeCursorOnHover(true)}
      onMouseLeave={() => changeCursorOnHover(false)}
      opacity={block.opacityMain}
      onClick={() => {
        if (!block.interactive) {
          toggleSwitch();
        }
      }}
    >
      <Rect
        width={block.width + 4}
        height={block.height + 2}
        fill={isHover ? "orange" : colorButton}
        cornerRadius={5}
        stroke={block.borderColor}
        strokeWidth={block.borderWidth}
      />
      <Text
        text={buttonText}
        align="center"
        fill="black"
        fontSize={block.size}
        fontFamily={block.fontName}
        fontStyle={block.fontStyle}
        wrap="word"
        width={block.width + 4}
        verticalAlign="middle"
        height={block.height + 2}
        lineHeight={1}
      />
    </Group>
  );
};

export default ButtonText;
