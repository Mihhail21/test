import { useState, useRef, useEffect } from "react";
import { RegularPolygon, Group, Line, Circle, Text, Rect, Image } from "react-konva";
import { IElectricGateValve } from "@/interface/shapes/ElectricGateValve";
import { Portal } from "react-konva-utils";
import { useParams } from "react-router-dom";
import { customToFixed } from "@/shared/utils/customToFixed";
import closeIcon from "../shared/assets/icons/buttonClose.svg";
import chartIcon from "../shared/assets/icons/chartIcon.svg";
import kvitirovanieIcon from "../shared/assets/icons/kvitirovanieIcon.svg";
import repairIcon from "../shared/assets/icons/repairIcon.svg";
import blockingIcon from "../shared/assets/icons/blockingIcon.svg";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import { universalCommands } from "@/shared/utils/commands";

const CLOSED_COLOR = "#6bf36b";
const OPENED_COLOR = "#ff1f1f";
const REPAIR_COLOR = "#808080";

const MOV_Status: string = "MOV_Status";
const MOV_MF: string = "MOV_MF";
const MOV_Repair: string = "MOV_Repair";
const MOV_PWR: string = "MOV_PWR";
const MOV_Time: string = "MOV_Time";
const MOV_Banopn: string = "MOV_Banopn";
const MOV_Bancls: string = "MOV_Bancls";

const vertical = "VERTICAL";
const verticalReverse = "VERTICAL_REVERSE";

interface ElectricGateValveProps {
  block: IElectricGateValve;
}

const ElectricGateValve = ({ block }: ElectricGateValveProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [closeIconImage, setCloseIconImage] = useState(new window.Image());
  const [chartIconImage, setChartIconImage] = useState(new window.Image());
  const [kvitirovanieIconImage, setCKvitirovanieIconImage] = useState(new window.Image());
  const [repairIconImage, setCRepairIconImage] = useState(new window.Image());
  const [blockingIconImage, setCBlockingIconImage] = useState(new window.Image());
  const [hoverState, setHoverState] = useState({ close: false, open: false, stop: false });

  useEffect(() => {
    const loadImage = (src: string, setImage: React.Dispatch<React.SetStateAction<HTMLImageElement>>) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setImage(img);
      };
    };
    loadImage(closeIcon, setCloseIconImage);
    loadImage(chartIcon, setChartIconImage);
    loadImage(kvitirovanieIcon, setCKvitirovanieIconImage);
    loadImage(repairIcon, setCRepairIconImage);
    loadImage(blockingIcon, setCBlockingIconImage);
  }, []);

  const MOV_Status_Value = getSampleValue(block.samples, MOV_Status);
  const MOV_MF_Value = getSampleValue(block.samples, MOV_MF);
  const MOV_Repair_Value = getSampleValue(block.samples, MOV_Repair);
  const MOV_PWR_Value = getSampleValue(block.samples, MOV_PWR);
  const MOV_Time_Value = getSampleValue(block.samples, MOV_Time);
  const MOV_Banopn_Value = getSampleValue(block.samples, MOV_Banopn);
  const MOV_Bancls_Value = getSampleValue(block.samples, MOV_Bancls);

  const prevStatusRef = useRef(MOV_Status_Value);
  useEffect(() => {
    prevStatusRef.current = MOV_Status_Value;
  }, [MOV_Status_Value]);

  const changeCursorOnHover = (button: "close" | "open" | "stop", isPointer: boolean) => {
    document.body.style.cursor = isPointer ? "pointer" : "default";
    setHoverState((prevState) => ({ ...prevState, [button]: isPointer }));
  };

  const handleCloseCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bhs", "_fhd");
  };

  const handleOpenCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bhoe", "_fhd");
  };

  const handleStopCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bst", "_fhd");
  };

  let leftTriangleColor: string = "";
  let rightTriangleColor: string = "";
  let circle: string = "";

  if (MOV_Repair_Value === 1) {
    leftTriangleColor = REPAIR_COLOR;
    rightTriangleColor = REPAIR_COLOR;
  } else if (MOV_Status_Value === 0) {
    leftTriangleColor = CLOSED_COLOR;
    rightTriangleColor = CLOSED_COLOR;
    circle = CLOSED_COLOR;
  } else if (MOV_Status_Value === 1) {
    leftTriangleColor = OPENED_COLOR;
    rightTriangleColor = OPENED_COLOR;
    circle = OPENED_COLOR;
  } else if (MOV_Status_Value > 0 && MOV_Status_Value < 1) {
    leftTriangleColor = CLOSED_COLOR;
    rightTriangleColor = OPENED_COLOR;
    circle = CLOSED_COLOR;
  }

  if (MOV_Status_Value > prevStatusRef.current) {
    circle = OPENED_COLOR;
  } else if (MOV_Status_Value < prevStatusRef.current) {
    circle = CLOSED_COLOR;
  }
  let rotation: number = 0;
  let offsetX: number = 0;
  let offsetY: number = 0;

  if (block.rotate === vertical) {
    rotation = 90;
    offsetX = 2;
    offsetY = -block.prefWidth / 2.2;
  } else if (block.rotate === verticalReverse) {
    rotation = 270;
    offsetX = -block.prefHeight / 1.8;
    offsetY = block.prefWidth / 18.5;
  } else {
    rotation = 0;
    offsetX = 0;
    offsetY = 0;
  }

  return (
    <>
      <Group
        x={block.x + block.prefWidth - block.prefWidth / 5 - 2}
        y={block.y + block.prefWidth / 1.5}
        rotation={rotation}
        offsetX={offsetX}
        offsetY={offsetY}
        // onClick={() => setModalVisible(true)}
      >

<Rect
          x={-block.prefWidth / 1.5}
          y={-block.prefHeight / 1.5}
          width={block.prefWidth}
          height={block.prefHeight}
          opacity={1}
          onClick={() => setModalVisible(true)}
        />
        <RegularPolygon
          sides={3}
          radius={block.prefHeight / 4 + 2}
          fill={leftTriangleColor}
          offsetX={0}
          offsetY={-block.prefHeight / 2 - 2}
          rotation={90}
          stroke="black"
          strokeWidth={1}
        />
        <RegularPolygon
          sides={3}
          radius={block.prefHeight / 4 + 2}
          fill={rightTriangleColor}
          offsetX={0}
          rotation={270}
          stroke="black"
          strokeWidth={1}
        />
        <Line
          points={[-block.prefHeight / 4 - 1, 0, -block.prefHeight / 4 - 1, -block.prefHeight / 2]}
          stroke="black"
          strokeWidth={2}
        />
        <Circle
          x={-block.prefHeight / 4}
          y={-block.prefHeight / 2}
          radius={block.prefHeight / 4}
          fill={circle}
          stroke="black"
          strokeWidth={1}
        />
        <Line
          points={[
            -block.prefWidth / 2.5,
            -block.prefWidth / 2.5,
            -block.prefWidth / 3.1,
            -block.prefWidth / 2,
            -block.prefWidth / 5,
            -block.prefWidth / 2.7,
            -block.prefWidth / 8.3,
            -block.prefWidth / 2.1,
          ]}
          stroke="black"
          tension={0.5}
          strokeWidth={1.5}
        />

        {MOV_Repair_Value === 1 && <Image image={repairIconImage} x={0} y={-30} width={10} height={10} />}

        {MOV_MF_Value === 1 && <Rect x={-38} y={-34} width={50} height={50} stroke="red" strokeWidth={2} />}
      </Group>

      {isModalVisible && (
        <Portal selector=".top-layer">
          <Group x={window.innerWidth / 2} y={window.innerHeight / 2} draggable>
            <Rect width={225} height={400} stroke="black" strokeWidth={2} cornerRadius={10} />
            <Rect
              width={225}
              height={400}
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
            <Image
              image={closeIconImage}
              x={195}
              y={12}
              width={25}
              height={25}
              onClick={() => setModalVisible(false)}
            />
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
            <Image image={chartIconImage} x={10} y={105} width={33} height={33} />
            <Image image={kvitirovanieIconImage} x={45} y={105} width={42} height={42} />
            <Image image={repairIconImage} x={90} y={103} width={36} height={36} />
            <Image image={blockingIconImage} x={135} y={103} width={36} height={36} />

            <Rect x={10} y={150} width={113} height={38 * 1.5} fill="rgb(245, 245, 245)" cornerRadius={[5, 5, 0, 0]} />

            <Text
              x={10}
              y={150}
              text={customToFixed(MOV_Status_Value * 100, 1) + "%"}
              fontSize={27}
              fill="black"
              fontFamily="Tahoma"
              align="center"
              width={112}
              height={57}
              verticalAlign="middle"
              fontStyle="bold"
            />
            <Line points={[10, 207, 120, 207]} stroke="rgb(185, 185, 185)" strokeWidth={2} />

            <Rect x={10} y={209} width={113} height={30} fill="rgb(20, 60, 84)" cornerRadius={[0, 0, 5, 5]} />

            <Text
              x={10}
              y={209}
              text={MOV_Time_Value + " сек"}
              fontSize={18}
              fill="#FFFFFF"
              fontFamily="Tahoma"
              align="center"
              width={113}
              fontStyle="bold"
              height={30}
              verticalAlign="middle"
            />

            <RegularPolygon
              x={150}
              y={222}
              sides={3}
              radius={20}
              fill={leftTriangleColor}
              rotation={90}
              stroke="black"
              strokeWidth={1}
            />

            <RegularPolygon
              x={188}
              y={222}
              sides={3}
              radius={20}
              fill={rightTriangleColor}
              offsetX={0}
              rotation={270}
              stroke="black"
              strokeWidth={1}
            />

            <Line points={[169, 222, 169, 202]} stroke="black" strokeWidth={2} />
            <Circle x={169} y={195} radius={13} fill={circle} stroke="black" strokeWidth={1} />
            <Line points={[161, 198, 167, 191, 172, 199, 177, 192]} stroke="black" tension={1} strokeWidth={2} />

            <Rect
              x={25}
              y={255}
              width={175}
              height={20}
              fill={MOV_Banopn_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={25}
              y={255}
              text="Запрет ОТКРЫТИЯ"
              fontSize={16}
              fill="#000"
              fontFamily="Tahoma"
              align="center"
              width={175}
              height={20}
              fontStyle="bold"
              verticalAlign="middle"
            />
            <Rect
              x={25}
              y={285}
              width={175}
              height={20}
              fill={MOV_Bancls_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={25}
              y={285}
              text="Запрет ЗАКРЫТИЯ"
              fontSize={16}
              fill="#000"
              fontFamily="Tahoma"
              align="center"
              width={175}
              height={20}
              fontStyle="bold"
              verticalAlign="middle"
            />
            <Rect
              x={25}
              y={315}
              width={175}
              height={20}
              fill={MOV_PWR_Value === 1 ? "#F5F5F5" : OPENED_COLOR}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={25}
              y={315}
              text="Управление"
              fontSize={16}
              fill="#000"
              fontFamily="Tahoma"
              align="center"
              width={175}
              height={20}
              fontStyle="bold"
              verticalAlign="middle"
            />
            <Group
              onMouseEnter={() => changeCursorOnHover("close", true)}
              onMouseLeave={() => changeCursorOnHover("close", false)}
              onClick={handleCloseCommands}
            >
              <Rect
                x={10}
                y={350}
                width={65}
                height={30}
                fill={hoverState.close ? "orange" : "white"}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={10}
                y={350}
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
                x={80}
                y={350}
                width={65}
                height={30}
                fill={hoverState.open ? "orange" : "white"}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={80}
                y={350}
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
            <Group
              onMouseEnter={() => changeCursorOnHover("stop", true)}
              onMouseLeave={() => changeCursorOnHover("stop", false)}
              onClick={handleStopCommands}
            >
              <Rect
                x={152}
                y={350}
                width={65}
                height={30}
                fill={hoverState.stop ? "orange" : "white"}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={152}
                y={350}
                width={65}
                height={30}
                text="СТОП"
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

export default ElectricGateValve;
