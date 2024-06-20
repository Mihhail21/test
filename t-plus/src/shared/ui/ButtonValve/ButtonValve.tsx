import React from "react";
import { Group, Rect, Text } from "react-konva";

interface ButtonValveProps {
  x: number;
  y: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  hoverState: boolean;
  text: string;
}

const ButtonValve: React.FC<ButtonValveProps> = ({ x, y, onMouseEnter, onMouseLeave, onClick, hoverState, text }) => {
  return (
    <Group x={x} y={y} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
      <Rect
        width={65}
        height={30}
        fill={hoverState ? "orange" : "white"}
        cornerRadius={5}
        stroke="black"
        strokeWidth={1}
      />
      <Text
        width={65}
        height={30}
        text={text}
        fontSize={16}
        fill="#000"
        fontFamily="Tahoma"
        align="center"
        fontStyle="bold"
        verticalAlign="middle"
      />
    </Group>
  );
};

export default ButtonValve;
