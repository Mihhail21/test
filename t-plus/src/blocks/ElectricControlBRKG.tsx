import { useState } from "react";
import { Group, Line, Rect, Text } from "react-konva";
import { useParams } from "react-router-dom";
import { Portal } from "react-konva-utils";
import { IElectricControlBRKG } from "@/interface";
import { sendCloseCommandsEL, sendOpenCommandsEL } from "@/shared/utils/commands";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import ButtonValve from "@/shared/ui/ButtonValve/ButtonValve";

interface IElectricControlBRKGProps {
  block: IElectricControlBRKG;
}

const BRKG_Status: string = "BRKG_Status";

const ElectricControlBRKG = ({ block }: IElectricControlBRKGProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [hoverState, setHoverState] = useState({ close: false, open: false });
  const strokeColor: string = `rgb(${block.red * 255}, ${block.green * 255}, ${block.blue * 255})`;

  const statusValue = getSampleValue(block.samples, BRKG_Status);

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

  // Координаты были рассчитаны на кадре http://localhost:5173/sverdlovsk/novosverdlovskaya/eso_oru_110_kv_2
  // При width = 23 height = 14

  //   const linePointsHorizontal = [
  //     [0, 2, 0, 12],
  //     [6, 0, 6, 14],
  //     [12, 2, 12, 12],

  //     [12, 7, 18, 7],

  //     [18, 2, 18, 12],
  //     [22, 4, 22, 10],
  //     [26, 8, 26, 6],
  // ];

  // const linePointsVertical = [
  //     [0, 2, 0, 12],
  //     [0, 7, 12, 7],
  //     [12, 2, 12, 12],

  //     [12, 7, 18, 7],

  //     [18, 2, 18, 12],
  //     [22, 4, 22, 10],
  //     [26, 8, 26, 6],
  // ];
  const linePointsHorizontal = [
    [0, block.height / 7, 0, block.height / 1.1],
    [block.width / 3.83, 0, block.width / 3.83, block.height],
    [block.width / 1.91, block.height / 7, block.width / 1.91, block.height / 1.166],

    [block.width / 1.91, block.height / 2, block.width / 1.277, block.height / 2],

    [block.width / 1.277, block.height / 10, block.width / 1.277, block.height / 1.1],
    [block.width / 1.12, block.height / 5, block.width / 1.12, block.height / 1.2],
    [block.width, block.height / 3, block.width, block.height / 1.5],
  ];

  const linePointsVertical = [
    [0, block.height / 7, 0, block.height / 1.166],
    [0, block.height / 2, block.width / 1.91, block.height / 2],
    [block.width / 1.91, block.height / 7, block.width / 1.91, block.height / 1.166],

    [block.width / 1.91, block.height / 2, block.width / 1.277, block.height / 2],

    [block.width / 1.27, block.height / 7, block.width / 1.277, block.height / 1.166],
    [block.width / 1.04, block.height / 3.5, block.width / 1.04, block.height / 1.4],
    [block.width / 0.88, block.height / 1.75, block.width / 0.88, block.height / 2.33],
  ];

  let linePoints: number[][] = [];
  let rotate: number = 0;
  let offsetY: number = 0;
  let offsetX: number = 0;

  if (block.rotate === "HORIZONTAL") {
    if (statusValue === 0) {
      rotate = 0;
      linePoints = linePointsHorizontal;
    } else {
      linePoints = linePointsVertical;
    }
  } else if (block.rotate === "VERTICAL") {
    if (statusValue === 0) {
      rotate = 90;
      offsetX = 2;
      offsetY = 17;
      linePoints = linePointsHorizontal;
    } else {
      rotate = 90;
      offsetX = 2;
      offsetY = 16.5;
      linePoints = linePointsVertical;
    }
  } else if (block.rotate === "HORIZONTAL_REVERSE") {
    if (statusValue === 0) {
      rotate = 180;
      offsetX = 20;
      offsetY = 13;
      linePoints = linePointsHorizontal;
    } else {
      rotate = 180;
      offsetX = 20;
      offsetY = 14;
      linePoints = linePointsVertical;
    }
  }

  return (
    <>
      <Group
        x={block.x + 2}
        y={block.y}
        rotation={rotate}
        offsetX={offsetX}
        offsetY={offsetY}
        onClick={() => setModalVisible(true)}
      >
        <Rect height={block.height} width={block.width} />
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
            <Line
              points={[95, 240, 125, 240]}
              stroke="black"
              strokeWidth={5}
              lineCap="round"
              shadowColor="black"
              shadowBlur={20}
            />
            <Line points={[100, 250, 120, 250]} stroke="black" strokeWidth={5} lineCap="round" />
            <Line points={[105, 260, 115, 260]} stroke="black" strokeWidth={5} lineCap="round" />

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

export default ElectricControlBRKG;
