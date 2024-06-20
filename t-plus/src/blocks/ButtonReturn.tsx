import { useState } from "react";
import { Group, Rect, Text } from "react-konva";
import { IButtonReturn } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import useSendCommand from "@/shared/api/useSendCommand";
import { useParams } from "react-router-dom";

const BUTTON_Status: string = "RETURN_BUTTON_Status";
let buttonText: string;
let colorButton: string;

interface IButtonReturnProps {
  block: IButtonReturn;
}

const ButtonReturn = ({ block }: IButtonReturnProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const { sendCommand } = useSendCommand(stationCode || "");
  const [isPressed, setIsPressed] = useState<boolean>(false);

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

  const changeCursor = (isPoiner: boolean) => {
    document.body.style.cursor = isPoiner ? "pointer" : "default";
  };

  const toggleSwitch = async () => {
    const command = isPressed ? { name: block.kks, value: 0 } : { name: block.kks, value: 1 };
    try {
      await sendCommand(command);
    } catch (error) {
      console.error("Ошибка при отправке команды переключения положения:", error);
    }
  };

  const handleMouseDown = (): void => {
    setIsPressed(true);
    toggleSwitch();
  };

  const handleMouseUp = (): void => {
    setIsPressed(false);
    toggleSwitch();
  };

  return (
    <Group
      x={block.x}
      y={block.y}
      onMouseEnter={() => changeCursor(true)}
      onMouseLeave={() => changeCursor(false)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      opacity={block.opacity}
    >
      <Rect
        width={block.width}
        height={block.height}
        fill={colorButton}
        cornerRadius={5}
        stroke={block.borderColor}
        strokeWidth={block.borderWidth}
      />
      <Text
        text={buttonText}
        height={block.height}
        width={block.width}
        fontSize={block.size}
        fontFamily={block.fontName}
        fontStyle={block.fontStyle}
        align="center"
        verticalAlign="middle"
        fill="black"
        wrap="word"
      />
    </Group>
  );
};

export default ButtonReturn;
