import { useState } from "react";
import { useParams } from "react-router-dom";
import { Rect, Group, Text, Line } from "react-konva";
import { Portal } from "react-konva-utils";
import { IElectricControlBreaker } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import { sendCloseCommandsEL, sendOpenCommandsEL } from "@/shared/utils/commands";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import ButtonValve from "@/shared/ui/ButtonValve/ButtonValve";

interface IElectricControlBreakerProps {
  block: IElectricControlBreaker;
}

const BRK_Status: string = "BRK_Status";

const CLOSED_COLOR: string = "#6bf36b";
const OPENED_COLOR: string = "#ff1f1f";

const ElectricControlBreaker = ({ block }: IElectricControlBreakerProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [hoverState, setHoverState] = useState({ close: false, open: false });

  const strokeColor = `rgb(${block.red * 255}, ${block.green * 255}, ${block.blue * 255})`;

  const statusValue = getSampleValue(block.samples, BRK_Status);
  const changeCursorOnHover = (button: "close" | "open", isPointer: boolean) => {
    document.body.style.cursor = isPointer ? "pointer" : "default";
    setHoverState((prevState) => ({ ...prevState, [button]: isPointer }));
  };
  const handleCloseCommands = async () => {
    await sendCloseCommandsEL(stationCode || "", block.kks);
  };

  const handleOpenCommands = async () => {
    await sendOpenCommandsEL(stationCode || "", block.kks);
  };

  let fill: string;
  if (statusValue === 0) {
    fill = CLOSED_COLOR;
  } else {
    fill = OPENED_COLOR;
  }

  return (
    <>
      <Rect
        x={block.x}
        y={block.y}
        width={block.width}
        height={block.height}
        fill={fill}
        stroke={strokeColor}
        strokeWidth={1}
        onClick={() => setModalVisible(true)}
      />
      {isModalVisible && (
        <Portal selector=".top-layer">
          <Group x={window.innerWidth / 2} y={window.innerHeight / 2} draggable>
            <Rect width={225} height={340} stroke="black" strokeWidth={2} cornerRadius={10} />
            <Rect
              width={225}
              height={340}
              fill="rgb(101, 116, 128)"
              stroke="rgb(185, 185, 185)"
              strokeWidth={1}
              cornerRadius={10}
            />

            <Rect
              width={225}
              height={51}
              fill="rgb(245, 245, 245)"
              stroke="rgb(185, 185, 185)"
              strokeWidth={1}
              cornerRadius={[10, 10, 0, 0]}
            />

            <CloseButton x={195} y={12} onClick={() => setModalVisible(false)} />
            <Text
              text={block.kks}
              fontSize={16}
              fill="black"
              fontFamily="Tahoma"
              fontStyle="bold"
              align="center"
              width={195}
              verticalAlign="middle"
              height={51}
            />
            <Text
              y={51}
              text={block.description || ""}
              fontSize={14}
              fill="#fff"
              fontFamily="Tahoma"
              align="center"
              width={225}
              verticalAlign="middle"
              height={38}
            />
            <Line points={[0, 93, 225, 93]} stroke="rgb(185, 185, 185)" strokeWidth={2} />
            <Line points={[110, 160, 110, 125]} stroke="black" strokeWidth={5} lineCap="round" />
            <Line points={[110, 200, 110, 240]} stroke="black" strokeWidth={5} lineCap="round" />
            <Rect
              x={90}
              y={160}
              width={40}
              height={40}
              fill={fill}
              stroke="black"
              strokeWidth={3}
              shadowColor="black"
              shadowBlur={30}
            />
            <ButtonValve
              x={35}
              y={280}
              text={"ОТКЛ"}
              onMouseEnter={() => changeCursorOnHover("close", true)}
              onMouseLeave={() => changeCursorOnHover("close", false)}
              onClick={handleCloseCommands}
              hoverState={hoverState.close}
            />
            <ButtonValve
              x={120}
              y={280}
              text={"ВКЛ"}
              onMouseEnter={() => changeCursorOnHover("open", true)}
              onMouseLeave={() => changeCursorOnHover("open", false)}
              onClick={handleOpenCommands}
              hoverState={hoverState.open}
            />
          </Group>
        </Portal>
      )}
    </>
  );
};

export default ElectricControlBreaker;
