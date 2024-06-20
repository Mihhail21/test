import { useState } from "react";
import { Portal } from "react-konva-utils";
import { useParams } from "react-router-dom";
import { RegularPolygon, Group, Line, Text, Rect } from "react-konva";
import { ISafetyValve } from "@/interface/shapes/SafetyValve";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import { universalCommands } from "@/shared/utils/commands";

const CLOSED_COLOR: string = "#69e169";
const OPENED_COLOR: string = "#ff1e1e";
const ORANGE_COLOR: string = "#FFA500";
const RLF_Status: string = "RLF_Status";

interface ISafetyValveProps {
  block: ISafetyValve;
}

const SafetyValve = ({ block }: ISafetyValveProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [hoverState, setHoverState] = useState({ close: false, open: false });
  const RLF_Status_Value = getSampleValue(block.samples, RLF_Status);

  const changeCursorOnHover = (button: "close" | "open", isPointer: boolean) => {
    document.body.style.cursor = isPointer ? "pointer" : "default";
    setHoverState((prevState) => ({ ...prevState, [button]: isPointer }));
  };

  const handleCloseCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bhs", "_fhd");
  };

  const handleOpenCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bhoe", "_fhd");
  };

  let leftTriangleColor: string = "";
  let rightTriangleColor: string = "";

  if (RLF_Status_Value === 0) {
    leftTriangleColor = CLOSED_COLOR;
    rightTriangleColor = CLOSED_COLOR;
  } else if (RLF_Status_Value === 1) {
    leftTriangleColor = OPENED_COLOR;
    rightTriangleColor = OPENED_COLOR;
  } else if (RLF_Status_Value > 0 && RLF_Status_Value < 1) {
    leftTriangleColor = CLOSED_COLOR;
    rightTriangleColor = OPENED_COLOR;
  }

  return (
    <>
      <Group
        x={block.x + block.prefHeight / 2}
        y={block.y + block.prefHeight / 2}
        rotation={block.scaleY === -1 ? 180 : 0}
        onClick={() => setModalVisible(true)}
      >
        <RegularPolygon
          sides={3}
          radius={block.prefHeight / 4 + 2}
          fill={leftTriangleColor}
          offsetX={-block.prefHeight / 25}
          offsetY={-block.prefHeight / 3.3}
          rotation={0}
          stroke="black"
          strokeWidth={0.5}
        />

        <RegularPolygon
          sides={3}
          radius={block.prefHeight / 4 + 2}
          fill={rightTriangleColor}
          offsetX={0}
          offsetY={
            block.scaleY === -1
              ? -block.prefHeight / 4.1 - 2
              : block.rotate === "HORIZONTAL_REVERSE"
              ? -block.prefHeight / 3.33
              : -block.prefHeight / 4.1
          }
          rotation={block.scaleY === -1 ? -90 : block.rotate === "HORIZONTAL_REVERSE" ? -90 : 90}
          stroke="black"
          strokeWidth={0.5}
        />

        <Line
          points={[
            block.prefWidth / 25,
            0,
            block.prefWidth / 25,
            -block.prefWidth / 7.1,
            block.prefWidth / 10,
            -block.prefWidth / 6.2,
            block.prefWidth / 25,
            -block.prefWidth / 4.5,
            block.prefWidth / 10,
            -block.prefWidth / 4.1,
            block.prefWidth / 25,
            -block.prefWidth / 3.5,
            block.prefWidth / 25,
            -block.prefWidth / 2.7,
          ]}
          stroke="black"
          strokeWidth={1}
          lineCap="round"
          lineJoin="round"
        />
      </Group>

      {isModalVisible && (
        <Portal selector=".top-layer">
          <Group x={window.innerWidth / 2} y={window.innerHeight / 2} draggable>
            <Rect width={225} height={250} stroke="black" strokeWidth={2} cornerRadius={10} />
            <Rect
              width={225}
              height={250}
              fill="rgb(101, 116, 128)"
              stroke="rgb(185, 185, 185)"
              strokeWidth={1}
              cornerRadius={10}
            />
            <Rect
              x={0}
              y={0}
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
              text={block.description || "пока нет данных"}
              fontSize={14}
              fill="#fff"
              fontFamily="Tahoma"
              align="center"
              width={225}
              verticalAlign="middle"
              height={38}
            />
            <Line points={[0, 93, 225, 93]} stroke="rgb(185, 185, 185)" strokeWidth={2} />

            <RegularPolygon
              x={88}
              y={152}
              sides={3}
              radius={22}
              fill={leftTriangleColor}
              rotation={90}
              stroke="black"
              strokeWidth={1}
            />

            <RegularPolygon
              x={110}
              y={175}
              sides={3}
              radius={22}
              fill={rightTriangleColor}
              offsetX={0}
              rotation={0}
              stroke="black"
              strokeWidth={1}
            />

            <Line points={[110, 155, 110, 140]} stroke="black" strokeWidth={2} />
            <Line points={[110, 140, 120, 140]} stroke="black" strokeWidth={2} />
            <Line points={[120, 140, 110, 135]} stroke="black" strokeWidth={2} />
            <Line points={[110, 135, 120, 130]} stroke="black" strokeWidth={2} />
            <Line points={[110, 130, 120, 130]} stroke="black" strokeWidth={2} />

            <Group
              onMouseEnter={() => changeCursorOnHover("close", true)}
              onMouseLeave={() => changeCursorOnHover("close", false)}
              onClick={handleCloseCommands}
            >
              <Rect
                x={35}
                y={210}
                width={65}
                height={30}
                fill={hoverState.close ? ORANGE_COLOR : "white"}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={35}
                y={210}
                text="ЗАКР"
                fontSize={16}
                fill="#000"
                fontFamily="Tahoma"
                align="center"
                width={65}
                height={30}
                fontStyle="bold"
                verticalAlign="middle"
              />
            </Group>
            <Group
              onMouseEnter={() => changeCursorOnHover("open", true)}
              onMouseLeave={() => changeCursorOnHover("open", false)}
              onClick={handleOpenCommands}
            >
              <Rect
                x={120}
                y={210}
                width={65}
                height={30}
                fill={hoverState.open ? ORANGE_COLOR : "white"}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={120}
                y={210}
                width={65}
                height={30}
                text="ОТКР"
                fontSize={16}
                fill="#000"
                fontFamily="Tahoma"
                align="center"
                fontStyle="bold"
                verticalAlign="middle"
              />
            </Group>
          </Group>
        </Portal>
      )}
    </>
  );
};

export default SafetyValve;
