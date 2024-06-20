import { useState } from "react";
import { Group, Rect, Text } from "react-konva";
import { IButton } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";

interface IButtonProps {
  block: IButton;
}

const BUTTON_Status = "BUTTON_Status";
let buttonText: string;
let colorButton: string;

const Button = ({ block }: IButtonProps) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const firstfillColor = `rgb(${block.red * 255}, ${block.green * 255}, ${block.blue * 255})`;
  const secondfillColor = `rgb(${block.red2 * 255}, ${block.green2 * 255}, ${block.blue2 * 255})`;

  const statusValue = getSampleValue(block.samples, BUTTON_Status);

  if (statusValue === 0 || statusValue === -1) {
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

  const openLink = () => {
    if (block.link) {
      window.location.href = block.link;
    }
  };

  return (
    <Group
      draggable
      x={block.x}
      y={block.y}
      onClick={openLink}
      onMouseEnter={() => changeCursorOnHover(true)}
      onMouseLeave={() => changeCursorOnHover(false)}
    >
      <Rect width={block.width} height={block.height} fill={isHover ? "orange" : colorButton} cornerRadius={5} />
      <Text
        text={buttonText}
        align="center"
        fill="black"
        fontSize={block.size}
        fontFamily={block.fontName}
        fontStyle={block.fontStyle}
        wrap="word"
        width={block.width}
        verticalAlign="middle"
        height={block.height}
        lineHeight={1}
      />
    </Group>
  );
};

export default Button;
