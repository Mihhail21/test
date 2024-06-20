import { useEffect, useRef } from "react";
import { Text } from "react-konva";
import Konva from "konva";
import { ITextMain } from "@/interface";

interface ITextMainProps {
  block: ITextMain;
}
const TextMain = ({ block }: ITextMainProps) => {
  const textRef = useRef<Konva.Text | null>(null);

  useEffect(() => {
    const textNode = textRef.current;
    if (textNode) {
      const width = textNode.textWidth;
      const height = textNode.textHeight;
      const lines = textNode.textArr;
      let offsetX = width / 2;
      let offsetY = height / 2;
      if (block.rotate === -90 && lines.length === 2) {
        offsetX = block.wrappingWidth / 2;
        offsetY = block.size;
      }
      textNode.offsetX(offsetX);
      textNode.offsetY(offsetY);
      textNode.x(block.x + width / 2);
      textNode.y(block.y - height / 2);
    }
  }, [block]);

  return (
    <Text
      ref={textRef}
      x={block.x}
      y={block.y}
      text={block.text}
      rotation={block.rotate}
      fontSize={block.size}
      fill={block.fill}
      width={block.wrappingWidth}
      align={block.textAlignment}
      fontFamily={block.fontName}
      fontStyle={block.fontStyle}
    />
  );
};
export default TextMain;
