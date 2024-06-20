import { useState } from "react";
import { Group, Rect, Line, Text } from "react-konva";
import { Portal } from "react-konva-utils";
import { useParams } from "react-router-dom";
import { IElectricControlBRK6 } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import ButtonValve from "@/shared/ui/ButtonValve/ButtonValve";
import { sendCloseCommandsEL, sendOpenCommandsEL } from "@/shared/utils/commands";

interface IElectricControlBRK6Props {
  block: IElectricControlBRK6;
}

const BRK6_Status: string = "BRK6_Status";
const BRK6_R: string = "BRK6_R";

const CLOSED_COLOR: string = "#35ff00";
const OPENED_COLOR: string = "#ff0000";
const REPAIR_COLOR: string = "#808080";

const ElectricControlBRK6 = ({ block }: IElectricControlBRK6Props) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [hoverState, setHoverState] = useState({ close: false, open: false });
  const strokeColor = `rgb(${block.red * 255}, ${block.green * 255}, ${block.blue * 255})`;

  const BRK6_Status_Value = getSampleValue(block.samples, BRK6_Status);
  const BRK6_R_Value = getSampleValue(block.samples, BRK6_R);

  const fill = BRK6_R_Value === 0 ? REPAIR_COLOR : BRK6_Status_Value === 0 ? CLOSED_COLOR : OPENED_COLOR;
  const offset = BRK6_R_Value === 0 ? (block.width / 3) * 2 : 0;

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

  return (
    <>
      <Group x={block.x} y={block.y} onClick={() => setModalVisible(true)}>
        {/* <Rect x={0} y={-19} width={block.width} height={50} fill="#252b37" /> */}
        {/* левая верхняя  */}
        <Line points={[6, 0, 0, 6]} stroke={strokeColor} strokeWidth={1} lineCap="round" lineJoin="round" />
        {/*  правая верхняя  */}
        <Line points={[6, 0, 12, 6]} stroke={strokeColor} strokeWidth={1} lineCap="round" lineJoin="round" />
        <Group x={offset}>
          {/* центральная  */}
          <Line points={[6, 4, 6, 32]} stroke={strokeColor} strokeWidth={1} lineCap="round" lineJoin="round" />

          {/* левая верхняя вторая */}
          <Line points={[6, 4, 0, 10]} stroke={strokeColor} strokeWidth={1} lineCap="round" lineJoin="round" />
          {/* правая верхняя вторая */}
          <Line points={[6, 4, 12, 10]} stroke={strokeColor} strokeWidth={1} lineCap="round" lineJoin="round" />

          <Rect
            y={block.height / 3}
            width={block.width}
            height={block.height / 3}
            fill={fill}
            stroke={strokeColor}
            strokeWidth={1}
          />

          {/* // down */}

          {/* правая нижняя верхняя  */}
          <Line points={[6, 32, 12, 26]} stroke={strokeColor} strokeWidth={1} lineCap="round" lineJoin="round" />

          {/* левая нижняя верхняя  */}
          <Line points={[6, 32, 0, 26]} stroke={strokeColor} strokeWidth={1} lineCap="round" lineJoin="round" />
        </Group>
        {/* правая нижняя нижняя  */}

        <Line points={[6, 36, 12, 30]} stroke={strokeColor} strokeWidth={1} lineCap="round" lineJoin="round" />

        {/* левая нижняя нижняя  */}
        <Line points={[6, 36, 0, 30]} stroke={strokeColor} strokeWidth={1} lineCap="round" lineJoin="round" />
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

            <Line points={[110, 160, 110, 125]} stroke={CLOSED_COLOR} strokeWidth={5} lineCap="round" />
            <Line points={[110, 120, 95, 135]} stroke={CLOSED_COLOR} strokeWidth={5} lineCap="round" />
            <Line points={[110, 120, 125, 135]} stroke={CLOSED_COLOR} strokeWidth={5} lineCap="round" />
            <Line points={[110, 100, 95, 115]} stroke={CLOSED_COLOR} strokeWidth={5} lineCap="round" />
            <Line points={[110, 100, 125, 115]} stroke={CLOSED_COLOR} strokeWidth={5} lineCap="round" />
            <Line points={[110, 200, 110, 240]} stroke={CLOSED_COLOR} strokeWidth={5} lineCap="round" />
            <Line points={[110, 260, 95, 245]} stroke={CLOSED_COLOR} strokeWidth={5} lineCap="round" />
            <Line points={[110, 260, 125, 245]} stroke={CLOSED_COLOR} strokeWidth={5} lineCap="round" />
            <Line points={[110, 240, 125, 225]} stroke={CLOSED_COLOR} strokeWidth={5} lineCap="round" />
            <Line points={[110, 240, 95, 225]} stroke={CLOSED_COLOR} strokeWidth={5} lineCap="round" />
            <Rect
              x={90}
              y={160}
              width={40}
              height={40}
              fill={fill}
              stroke={strokeColor}
              strokeWidth={4}
              shadowColor="black"
              shadowBlur={20}
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

export default ElectricControlBRK6;
