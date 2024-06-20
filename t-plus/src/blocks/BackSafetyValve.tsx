import { useState, useEffect } from "react";
import { RegularPolygon, Group, Text, Line, Rect, Image } from "react-konva";
import { useParams } from "react-router-dom";
import { Portal } from "react-konva-utils";
import { customToFixed } from "@/shared/utils/customToFixed";
import { IBackSafetyValve } from "@/interface";
import chartIcon from "../shared/assets/icons/chartIcon.svg";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import kvitirovanieIcon from "../shared/assets/icons/kvitirovanieIcon.svg";
import repairIcon from "../shared/assets/icons/repairIcon.svg";
import blockingIcon from "../shared/assets/icons/blockingIcon.svg";
import { universalCommands } from "@/shared/utils/commands";


const CLOSED_COLOR: string = "#6bf36b";
const OPENED_COLOR: string = "#ff1f1f";
const REPAIR_COLOR: string = "#808080";
const BLACK_COLOR: string = "#000000";

const SOL_Status: string = "SOL_Status";
const SOL_MF: string = "SOL_MF";
const SOL_Repair: string = "SOL_Repair";
const SOL_PWR: string = "SOL_PWR";
const SOL_Banopn: string = "SOL_Banopn";
const SOL_Bancls: string = "SOL_Bancls";
const vertical: string = "VERTICAL";
const verticalReverse: string = "VERTICAL_REVERSE";

interface ISafetyShutOffValveProps {
  block: IBackSafetyValve;
}

const BackSafetyValve = ({ block }: ISafetyShutOffValveProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [chartIconImage, setChartIconImage] = useState(new window.Image());
  const [kvitirovanieIconImage, setCKvitirovanieIconImage] = useState(new window.Image());
  const [repairIconImage, setCRepairIconImage] = useState(new window.Image());
  const [blockingIconImage, setCBlockingIconImage] = useState(new window.Image());
  const [hoverState, setHoverState] = useState({ close: false, open: false });

  useEffect(() => {
    const loadImage = (src: string, setImage: React.Dispatch<React.SetStateAction<HTMLImageElement>>) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setImage(img);
      };
    };
    loadImage(chartIcon, setChartIconImage);
    loadImage(kvitirovanieIcon, setCKvitirovanieIconImage);
    loadImage(repairIcon, setCRepairIconImage);
    loadImage(blockingIcon, setCBlockingIconImage);
  }, []);

  const SOL_Status_Value = getSampleValue(block.samples, SOL_Status);
  const SOL_MF_Value = getSampleValue(block.samples, SOL_MF);
  const SOL_Repair_Value = getSampleValue(block.samples, SOL_Repair);
  const SOL_PWR_Value = getSampleValue(block.samples, SOL_PWR);
  const SOL_Banopn_Value = getSampleValue(block.samples, SOL_Banopn);
  const SOL_Bancls_Value = getSampleValue(block.samples, SOL_Bancls);

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
  let lightning: string = "";

  if (SOL_Repair_Value === 1) {
    leftTriangleColor = REPAIR_COLOR;
    rightTriangleColor = REPAIR_COLOR;
    lightning = REPAIR_COLOR;
  } else if (SOL_Status_Value <= 0.1) {
    leftTriangleColor = BLACK_COLOR;
    rightTriangleColor = CLOSED_COLOR;
    lightning = CLOSED_COLOR;
  } else {
    leftTriangleColor = BLACK_COLOR;
    rightTriangleColor = OPENED_COLOR;
    lightning = OPENED_COLOR;
  }

  let rotation: number = 0;
  let offsetX: number = 0;
  let offsetY: number = 0;
  if (block.rotate === vertical) {
    rotation = 90;
    offsetX = -block.prefWidth / 5;
    offsetY = -block.prefWidth / 2;
  } else if (block.rotate === verticalReverse) {
    rotation = 270;
    offsetX = -block.prefWidth / 3.33;
    offsetY = block.prefWidth / 3;
  } else {
    rotation = 0;
    offsetX = block.prefWidth / 5;
    offsetY = -block.prefWidth / 7.14;
  }

  return (
    <>
      <Group
        x={block.x + block.prefWidth}
        y={block.y + block.prefHeight / 2}
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
          radius={block.prefWidth / 4 + 2}
          fill={leftTriangleColor}
          offsetX={0}
          offsetY={-block.prefWidth / 2 - 2}
          rotation={90}
          stroke="black"
          strokeWidth={1}
        />
        <RegularPolygon
          sides={3}
          radius={block.prefWidth / 4 + 2}
          fill={rightTriangleColor}
          offsetX={0}
          rotation={270}
          stroke="black"
          strokeWidth={1}
        />

        <Line
          points={[
            -block.prefWidth / 3.57,
            -block.prefWidth / 10,
            -block.prefWidth / 6.25,
            -block.prefWidth / 4.16,
            -block.prefWidth / 3.57,
            -block.prefWidth / 3.1,
            -block.prefWidth / 5,
            -block.prefWidth / 2.2,
          ]}
          stroke={lightning}
          strokeWidth={3}
          lineCap="round"
          lineJoin="round"
        />
        {SOL_Repair_Value === 1 && <Image image={repairIconImage} x={0} y={-30} width={10} height={10} />}

        {SOL_MF_Value === 1 && <Rect x={-38} y={-34} width={50} height={50} stroke="red" strokeWidth={2} />}
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
            <Image image={chartIconImage} x={10} y={105} width={33} height={33} />
            <Image image={kvitirovanieIconImage} x={45} y={105} width={42} height={42} />
            <Image image={repairIconImage} x={90} y={103} width={36} height={36} />
            <Image image={blockingIconImage} x={135} y={103} width={36} height={36} />

            <Rect x={10} y={185} width={113} height={57} fill="rgb(245, 245, 245)" cornerRadius={10} />

            <Text
              x={10}
              y={185}
              text={customToFixed(SOL_Status_Value * 100, 1) + "%"}
              fontSize={27}
              fill="black"
              fontFamily="Tahoma"
              align="center"
              width={112}
              height={57}
              verticalAlign="middle"
              fontStyle="bold"
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

            <Line
              points={[170, 215, 176, 205, 165, 200, 170, 190]}
              stroke="black"
              strokeWidth={7}
              lineCap="round"
              lineJoin="round"
            />
            <Line
              points={[170, 215, 176, 205, 165, 200, 170, 190]}
              stroke={lightning}
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />

            <Rect
              x={25}
              y={255}
              width={175}
              height={20}
              fill={SOL_Banopn_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
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
              fill={SOL_Bancls_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
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
              fill={SOL_PWR_Value === 1 ? "#F5F5F5" : OPENED_COLOR}
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
                x={35}
                y={350}
                width={65}
                height={30}
                fill={hoverState.close ? "orange" : "white"}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={35}
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
                x={120}
                y={350}
                width={65}
                height={30}
                fill={hoverState.open ? "orange" : "white"}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={120}
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
          </Group>
        </Portal>
      )}
    </>
  );
};

export default BackSafetyValve;
