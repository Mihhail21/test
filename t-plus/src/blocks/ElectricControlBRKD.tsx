import { useState } from "react";
import { Group, Line, Rect, Text } from "react-konva";
import { useParams } from "react-router-dom";
import { Portal } from "react-konva-utils";
import { IElectricControlBRKD } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import { sendCloseCommandsEL, sendOpenCommandsEL } from "@/shared/utils/commands";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import ButtonValve from "@/shared/ui/ButtonValve/ButtonValve";

interface IElectricControlBRKDProps {
  block: IElectricControlBRKD;
}

const BRKD_Status: string = "BRKD_Status";
const EXTRA: number = 2;

const ElectricControlBRKD = ({ block }: IElectricControlBRKDProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [hoverState, setHoverState] = useState({ close: false, open: false });

  const strokeColor: string = `rgb(${block.red * 255}, ${block.green * 255}, ${block.blue * 255})`;

  const statusValue = getSampleValue(block.samples, BRKD_Status);

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

  let linePoints: number[][] = [];
  if (block.rotate === "VERTICAL") {
    if (statusValue === 0) {
      linePoints = [
        [0, 0, block.width, 0],
        [-EXTRA, block.height / 2, block.width + EXTRA, block.height / 2],
        [0, block.height, block.width, block.height],
      ];
    } else {
      linePoints = [
        [0, 0, block.width, 0],
        [block.width / 2, 0, block.width / 2, block.height],
        [0, block.height, block.width, block.height],
      ];
    }
  } else if (block.rotate === "HORIZONTAL") {
    if (statusValue === 0) {
      linePoints = [
        [0, 0, 0, block.height],
        [block.width / 2, 0 - EXTRA, block.width / 2, block.height + EXTRA],
        [block.width, 0, block.width, block.height],
      ];
    } else {
      linePoints = [
        [0, 0, 0, block.height],
        [0, block.height / 2, block.width, block.height / 2],
        [block.width, 0, block.width, block.height],
      ];
    }
  }

  return (
    <>
      <Group x={block.x} y={block.y} onClick={() => setModalVisible(true)}>
        <Rect width={block.width} height={block.height} opacity={0} />
        {linePoints.map((points, index) => (
          <Line key={index} points={points} stroke={strokeColor} strokeWidth={1} />
        ))}
      </Group>
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
            <Line points={[90, 160, 130, 160]} stroke="black" strokeWidth={5} lineCap="round" />

            {statusValue === 1 && (
              <Line
                points={[110, 160, 110, 200]}
                stroke="black"
                strokeWidth={5}
                lineCap="round"
                shadowColor="black"
                shadowBlur={20}
              />
            )}
            {statusValue === 0 && (
              <Line
                points={[80, 180, 140, 180]}
                stroke="black"
                strokeWidth={5}
                lineCap="round"
                shadowColor="black"
                shadowBlur={20}
              />
            )}

            <Line points={[90, 200, 130, 200]} stroke="black" strokeWidth={5} lineCap="round" />
            <Line points={[110, 200, 110, 240]} stroke="black" strokeWidth={5} lineCap="round" />
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

export default ElectricControlBRKD;
