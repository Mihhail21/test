import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RegularPolygon, Group, Line, Rect, Image, Text } from "react-konva";
import { Portal, Html } from "react-konva-utils";
import { IRegulator } from "@/interface/shapes/Regulator";
import useHoverState from "@/shared/model/useHoverState";
import useSendCommand from "@/shared/api/useSendCommand";
import chartIcon from "../shared/assets/icons/chartIcon.svg";
import kvitirovanieIcon from "../shared/assets/icons/kvitirovanieIcon.svg";
import repairIcon from "../shared/assets/icons/repairIcon.svg";
import blockingIcon from "../shared/assets/icons/blockingIcon.svg";
import doneIcon from "../shared/assets/icons/doneIcon.svg";
import { customToFixed } from "@/shared/utils/customToFixed";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import { universalCommand, universalCommands } from "@/shared/utils/commands";

const CLOSED_COLOR = "#6bf36b";
const OPENED_COLOR = "#ff1f1f";
const REPAIR_COLOR = "#808080";
const ORANGE_COLOR = "#FFA500";
const BLUE_COLOR = "#0000FF";
const PURPLE_COLOR = "#9370DB";

const CNT_Status: string = "CNT_Status";
const CNT_MF: string = "CNT_MF";
const CNT_Repair: string = "CNT_Repair";
const CNT_PWR: string = "CNT_PWR";
const CNT_AUTO: string = "CNT_Auto_Output";
const CNT_MANUAL: string = "CNT_Manual_Output";
const CNT_Banopn: string = "CNT_Banopn";
const CNT_Bancls: string = "CNT_Bancls";
const CNT_Detector_min: string = "CNT_Detector_min";
const CNT_Detector_max: string = "CNT_Detector_max";
const CNT_Detector: string = "CNT_Detector";
const CNT_CMD_Setpoint1: string = "CNT_CMD_Setpoint1";
const CNT_CMD_Setpoint: string = "CNT_CMD_Setpoint";

const vertical = "VERTICAL";
const verticalReverse = "VERTICAL_REVERSE";

interface IRegulatorProps {
  block: IRegulator;
}

const Regulator = ({ block }: IRegulatorProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const { sendCommand } = useSendCommand(stationCode || "");
  const [hoverState, setHover] = useHoverState();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [chartIconImage, setChartIconImage] = useState(new window.Image());
  const [kvitirovanieIconImage, setCKvitirovanieIconImage] = useState(
    new window.Image()
  );
  const [repairIconImage, setCRepairIconImage] = useState(new window.Image());
  const [blockingIconImage, setCBlockingIconImage] = useState(
    new window.Image()
  );
  const [doneIconImage, setDoneIconImage] = useState(new window.Image());
  const [inputValue, setInputValue] = useState("");
  const [inputValueCMD, setInputValueCMD] = useState("");

  useEffect(() => {
    const loadImage = (
      src: string,
      setImage: React.Dispatch<React.SetStateAction<HTMLImageElement>>
    ) => {
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
    loadImage(doneIcon, setDoneIconImage);
  }, []);

  const handleMouseEnter = (key: keyof typeof hoverState) => {
    setHover(key, true);
    document.body.style.cursor = "pointer";
  };

  const handleMouseLeave = (key: keyof typeof hoverState) => {
    setHover(key, false);
    document.body.style.cursor = "default";
  };

  const CNT_Status_Value = getSampleValue(block.samples, CNT_Status);
  const CNT_MF_Value = getSampleValue(block.samples, CNT_MF);
  const CNT_Repair_Value = getSampleValue(block.samples, CNT_Repair);
  const CNT_PWR_Value = getSampleValue(block.samples, CNT_PWR);
  const CNT_AUTO_Value = getSampleValue(block.samples, CNT_AUTO);
  const CNT_MANUAL_Value = getSampleValue(block.samples, CNT_MANUAL);
  const CNT_Banopn_Value = getSampleValue(block.samples, CNT_Banopn);
  const CNT_Bancls_Value = getSampleValue(block.samples, CNT_Bancls);
  const CNT_Detector_min_Value = getSampleValue(
    block.samples,
    CNT_Detector_min
  );
  const CNT_Detector_max_Value = getSampleValue(
    block.samples,
    CNT_Detector_max
  );
  const CNT_Detector_Value = getSampleValue(block.samples, CNT_Detector);
  const CNT_CMD_Setpoint1_Value = getSampleValue(
    block.samples,
    CNT_CMD_Setpoint1
  );
  const CNT_CMD_Setpoint_Value = getSampleValue(
    block.samples,
    CNT_CMD_Setpoint
  );

  const prevStatusRef = useRef(CNT_Status_Value);

  useEffect(() => {
    prevStatusRef.current = CNT_Status_Value;
  }, [CNT_Status_Value]);

  useEffect(() => {
    setInputValue((CNT_CMD_Setpoint_Value * 100).toString());
    setInputValueCMD(CNT_CMD_Setpoint1_Value.toString());
  }, [CNT_CMD_Setpoint_Value, CNT_CMD_Setpoint1_Value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleInputChangeCMD = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueCMD(event.target.value);
  };

  const handleCloseCommands = async () => {
    await universalCommands(
      stationCode || "",
      block.kks,
      "ycc",
      "_bhs",
      "_fhd"
    );
  };

  const handleOpenCommands = async () => {
    await universalCommands(
      stationCode || "",
      block.kks,
      "ycc",
      "_bhoe",
      "_fhd"
    );
  };

  const handleAutoCommands = async () => {
    await universalCommands(
      stationCode || "",
      block.kks,
      "ycc",
      "_bha",
      "_fhd"
    );
  };

  const handleStepBackCommands = async () => {
    await universalCommands(
      stationCode || "",
      block.kks,
      "zdi",
      "_less",
      "_fhd"
    );
  };

  const handleStepUpCommands = async () => {
    await universalCommands(
      stationCode || "",
      block.kks,
      "zdi",
      "_more",
      "_fhd"
    );
  };

  const handleValueCMDCommand = async () => {
    await universalCommand(
      stationCode || "",
      block.kks,
      "r_",
      "_zd",
      Number(inputValueCMD)
    );
  };

  const sendValueCommands = async () => {
    const updateValue = Number(inputValue) * 0.01;
    const commands = [
      { name: `zai${block.kks}ai`, value: updateValue },
      { name: `zdi${block.kks}_set`, value: 1 },
      { name: `zdi${block.kks}_set`, value: 0 },
    ];

    for (const command of commands) {
      try {
        await sendCommand(command);
      } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
        break;
      }
    }
  };

  let leftTriangleColor: string = "";
  let rightTriangleColor: string = "";
  let upperTriangleColor: string = "";

  if (CNT_PWR_Value === 0) {
    leftTriangleColor = REPAIR_COLOR;
    rightTriangleColor = REPAIR_COLOR;
  } else if (CNT_Status_Value === 0) {
    leftTriangleColor = CLOSED_COLOR;
    rightTriangleColor = CLOSED_COLOR;
    upperTriangleColor = CLOSED_COLOR;
  } else if (CNT_Status_Value === 1) {
    leftTriangleColor = OPENED_COLOR;
    rightTriangleColor = OPENED_COLOR;
    upperTriangleColor = OPENED_COLOR;
  } else if (CNT_Status_Value > 0 && CNT_Status_Value < 1) {
    leftTriangleColor = CLOSED_COLOR;
    rightTriangleColor = OPENED_COLOR;
    upperTriangleColor = CLOSED_COLOR;
  }

  if (CNT_Status_Value > prevStatusRef.current) {
    upperTriangleColor = OPENED_COLOR;
  } else if (CNT_Status_Value < prevStatusRef.current) {
    upperTriangleColor = CLOSED_COLOR;
  }
  const widthProgressBarDetector =
    ((CNT_Detector_Value - CNT_Detector_min_Value) /
      (CNT_Detector_max_Value - CNT_Detector_min_Value)) *
    100;
  const widthProgressBarCMD =
    ((CNT_CMD_Setpoint1_Value - CNT_Detector_min_Value) /
      (CNT_Detector_max_Value - CNT_Detector_min_Value)) *
    100;
  const progressBarWidth =
    (block.prefWidth - block.prefWidth / 4) * CNT_Status_Value;

  let rotation: number = 0;
  let offsetX: number = 0;
  let offsetY: number = 0;

  if (block.rotate === vertical) {
    rotation = 90;
    offsetX = 2;
    offsetY = -block.prefWidth / 2 - 2;
  } else if (block.rotate === verticalReverse) {
    rotation = 270;
    offsetX = -block.prefHeight / 2;
    offsetY = block.prefWidth / 3.3;
  } else {
    rotation = 0;
    offsetX = 5;
    offsetY = block.prefWidth / 12;
  }

  return (
    <>
      <Group
        draggable
        x={block.x + block.prefHeight}
        y={block.y + block.prefHeight / 1.5}
        rotation={rotation}
        offsetX={offsetX}
        offsetY={offsetY}
      >
        <Rect
          x={-block.prefWidth / 1.5}
          y={-block.prefHeight / 1.5}
          width={block.prefWidth}
          height={block.prefHeight}
          opacity={1}
          onClick={() => setModalVisible(true)}
        />
        <Rect
          x={-block.prefWidth / 1.6}
          y={block.prefWidth / 4}
          width={block.prefWidth / 1.3}
          height={5}
          fill="gray"
          stroke="black"
          strokeWidth={1}
        />
        <Rect
          x={-block.prefWidth / 1.6}
          y={block.prefWidth / 4}
          width={progressBarWidth}
          height={5}
          fill="blue"
          stroke="black"
          strokeWidth={0.5}
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
          points={[
            block.prefWidth / 4.1,
            block.prefWidth / 6.2,
            block.prefWidth / 1.7,
            block.prefWidth / 2.3,
            -block.prefWidth / 12.5,
            block.prefWidth / 2.3,
          ]}
          fill={upperTriangleColor}
          stroke="black"
          strokeWidth={1}
          closed
          offsetX={block.prefWidth / 2}
          offsetY={block.prefWidth / 1.4}
        />

        {/* {CNT_Repair_Value === 1 && (
        <KonvaImage image={imageRef.current} x={0} y={-30} width={10} height={10} />
      )}

      {CNT_MF_Value === 1 && <Rect x={-38} y={-34} width={50} height={50} stroke="red" strokeWidth={2} />} */}
      </Group>
      {isModalVisible && (
        <Portal selector=".top-layer">
          <Group x={window.innerWidth / 2} y={window.innerHeight / 2} draggable>
            <Rect
              width={225}
              height={500}
              stroke="black"
              strokeWidth={3}
              cornerRadius={10}
            />
            <Rect
              width={225}
              height={500}
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
            <CloseButton
              x={195}
              y={12}
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

            <Line
              points={[0, 93, 225, 93]}
              stroke="rgb(185, 185, 185)"
              strokeWidth={2}
            />
            <Image
              image={chartIconImage}
              x={10}
              y={105}
              width={33}
              height={33}
            />
            <Image
              image={kvitirovanieIconImage}
              x={45}
              y={105}
              width={42}
              height={42}
            />
            <Image
              image={repairIconImage}
              x={90}
              y={103}
              width={36}
              height={36}
            />
            <Image
              image={blockingIconImage}
              x={135}
              y={103}
              width={36}
              height={36}
            />

            <Rect
              x={10}
              y={150}
              width={113}
              height={57}
              fill="rgb(245, 245, 245)"
              cornerRadius={10}
            />

            <Text
              x={10}
              y={150}
              text={customToFixed(CNT_Status_Value * 100, 1) + "%"}
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
              y={180}
              sides={3}
              radius={20}
              fill={leftTriangleColor}
              rotation={90}
              stroke="black"
              strokeWidth={1}
            />

            <RegularPolygon
              x={188}
              y={180}
              sides={3}
              radius={20}
              fill={rightTriangleColor}
              offsetX={0}
              rotation={270}
              stroke="black"
              strokeWidth={1}
            />

            <Line
              points={[147, 160, 169, 140, 192, 160]}
              fill={upperTriangleColor}
              stroke="black"
              strokeWidth={1}
              closed
            />
            <Group
              onMouseEnter={() => handleMouseEnter("auto")}
              onMouseLeave={() => handleMouseLeave("auto")}
              onClick={handleAutoCommands}
            >
              <Rect
                x={10}
                y={210}
                width={50}
                height={30}
                fill={
                  hoverState.auto
                    ? ORANGE_COLOR
                    : CNT_AUTO_Value === 0
                    ? "#F5F5F5"
                    : CLOSED_COLOR
                }
                cornerRadius={5}
              />
              <Text
                x={10}
                y={210}
                width={50}
                height={30}
                text="АВТ"
                fontSize={16}
                fill="#000"
                fontFamily="Tahoma"
                align="center"
                fontStyle="bold"
                verticalAlign="middle"
              />
            </Group>

            <Group
              onMouseEnter={() => handleMouseEnter("hand")}
              onMouseLeave={() => handleMouseLeave("hand")}
              onClick={handleAutoCommands}
            >
              <Rect
                x={70}
                y={210}
                width={50}
                height={30}
                fill={
                  hoverState.hand
                    ? ORANGE_COLOR
                    : CNT_MANUAL_Value === 0
                    ? "#F5F5F5"
                    : CLOSED_COLOR
                }
                cornerRadius={5}
              />
              <Text
                x={70}
                y={210}
                width={50}
                height={30}
                text="РУЧ"
                fontSize={16}
                fill="#000"
                fontFamily="Tahoma"
                align="center"
                fontStyle="bold"
                verticalAlign="middle"
              />
            </Group>
            <Group
              onMouseEnter={() => handleMouseEnter("stepBack")}
              onMouseLeave={() => handleMouseLeave("stepBack")}
              onClick={handleStepBackCommands}
            >
              <Rect
                x={135}
                y={210}
                width={30}
                height={30}
                fill={hoverState.stepBack ? ORANGE_COLOR : "white"}
                cornerRadius={5}
              />
              <RegularPolygon
                x={152}
                y={225}
                sides={3}
                radius={12}
                fill={hoverState.stepBack ? CLOSED_COLOR : "gray"}
                rotation={270}
              />
            </Group>
            <Group
              onMouseEnter={() => handleMouseEnter("stepUp")}
              onMouseLeave={() => handleMouseLeave("stepUp")}
              onClick={handleStepUpCommands}
            >
              <Rect
                x={175}
                y={210}
                width={30}
                height={30}
                fill={hoverState.stepUp ? "orange" : "white"}
                cornerRadius={5}
              />
              <RegularPolygon
                x={188}
                y={225}
                sides={3}
                radius={12}
                fill={hoverState.stepUp ? CLOSED_COLOR : "gray"}
                rotation={90}
              />
            </Group>
            <Group
              x={10}
              y={250}
              onMouseEnter={() => handleMouseEnter("done1")}
              onMouseLeave={() => handleMouseLeave("done1")}
              onClick={sendValueCommands}
            >
              <Html>
                <input
                  style={{
                    width: "45px",
                    height: "24px",
                    borderRadius: "5px",
                    border: "none",
                    outline: "none",
                    textAlign: "center",
                  }}
                  placeholder=""
                  value={inputValue}
                  onChange={handleInputChange}
                />
              </Html>
              <Rect
                x={55}
                y={0}
                width={30}
                height={25}
                fill={hoverState.done1 ? ORANGE_COLOR : "white"}
                cornerRadius={5}
              />
              <Image
                image={doneIconImage}
                x={57}
                y={0}
                width={25}
                height={25}
              />
            </Group>

            <Rect
              x={105}
              y={255}
              width={100}
              height={15}
              fill="rgb(245, 245, 245)"
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Rect
              x={105}
              y={255}
              width={CNT_Status_Value * 100}
              height={15}
              fill={BLUE_COLOR}
              cornerRadius={4}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={102}
              y={275}
              text="0"
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
            />
            <Text
              x={148}
              y={275}
              text="50"
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
            />
            <Text
              x={198}
              y={275}
              text="100"
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
            />

            <Group
              x={10}
              y={290}
              onMouseEnter={() => handleMouseEnter("done2")}
              onMouseLeave={() => handleMouseLeave("done2")}
              onClick={handleValueCMDCommand}
            >
              <Html>
                <input
                  style={{
                    width: "45px",
                    height: "24px",
                    borderRadius: "5px",
                    border: "none",
                    outline: "none",
                    textAlign: "center",
                  }}
                  placeholder=""
                  value={inputValueCMD}
                  onChange={handleInputChangeCMD}
                />
              </Html>
              <Rect
                x={55}
                y={0}
                width={30}
                height={25}
                fill={hoverState.done2 ? ORANGE_COLOR : "white"}
                cornerRadius={5}
              />
              <Image
                image={doneIconImage}
                x={57}
                y={0}
                width={25}
                height={25}
              />
            </Group>

            <Rect
              x={105}
              y={295}
              width={100}
              height={15}
              fill="rgb(245, 245, 245)"
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Rect
              x={105}
              y={295}
              width={Number(customToFixed(widthProgressBarCMD, 0))}
              height={15}
              fill={ORANGE_COLOR}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={170}
              y={315}
              text={customToFixed(CNT_Detector_max_Value, 0)}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
              align="right"
              width={40}
            />
            <Text
              x={100}
              y={315}
              text={customToFixed(CNT_Detector_min_Value, 0)}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
              align="left"
              width={40}
            />

            <Rect
              x={40}
              y={330}
              width={55}
              height={25}
              fill="rgb(245, 245, 245)"
              cornerRadius={5}
            />

            <Text
              x={40}
              y={330}
              text={customToFixed(CNT_Detector_Value, 0)}
              fontSize={12}
              fill="#000"
              fontFamily="Tahoma"
              align="center"
              width={55}
              height={25}
              fontStyle="bold"
              verticalAlign="middle"
            />
            <Rect
              x={105}
              y={335}
              width={100}
              height={15}
              fill="rgb(245, 245, 245)"
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Rect
              x={105}
              y={335}
              width={widthProgressBarDetector || 0}
              height={15}
              fill={PURPLE_COLOR}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={170}
              y={355}
              text={customToFixed(CNT_Detector_max_Value, 0)}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
              align="right"
              width={40}
            />
            <Text
              x={100}
              y={355}
              text={customToFixed(CNT_Detector_min_Value, 0)}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
              align="left"
              width={40}
            />
            <Rect
              x={25}
              y={370}
              width={175}
              height={20}
              fill={CNT_Banopn_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={25}
              y={370}
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
              y={400}
              width={175}
              height={20}
              fill={CNT_Bancls_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={25}
              y={400}
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
              y={430}
              width={175}
              height={20}
              fill={CNT_PWR_Value === 1 ? "#F5F5F5" : OPENED_COLOR}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={25}
              y={430}
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
              onMouseEnter={() => handleMouseEnter("close")}
              onMouseLeave={() => handleMouseLeave("close")}
              onClick={handleCloseCommands}
            >
              <Rect
                x={35}
                y={460}
                width={65}
                height={30}
                fill={hoverState.close ? ORANGE_COLOR : "white"}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={35}
                y={460}
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
              onMouseEnter={() => handleMouseEnter("open")}
              onMouseLeave={() => handleMouseLeave("open")}
              onClick={handleOpenCommands}
            >
              <Rect
                x={120}
                y={460}
                width={65}
                height={30}
                fill={hoverState.open ? ORANGE_COLOR : "white"}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={120}
                y={460}
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

export default Regulator;
