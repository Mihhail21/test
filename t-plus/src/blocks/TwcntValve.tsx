import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RegularPolygon, Group, Line, Rect, Image, Text } from "react-konva";
import { Portal, Html } from "react-konva-utils";
import { ITwcntValve } from "@/interface";
import useHoverState from "@/shared/model/useHoverState";
import useSendCommand from "@/shared/api/useSendCommand";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import { customToFixed } from "@/shared/utils/customToFixed";
import chartIcon from "../shared/assets/icons/chartIcon.svg";
import kvitirovanieIcon from "../shared/assets/icons/kvitirovanieIcon.svg";
import repairIcon from "../shared/assets/icons/repairIcon.svg";
import blockingIcon from "../shared/assets/icons/blockingIcon.svg";
import doneIcon from "../shared/assets/icons/doneIcon.svg";
import { universalCommands } from "@/shared/utils/commands";

const TWCNT_Status_Left: string = "TWCNT_Status_Left";
const TWCNT_Status_Right: string = "TWCNT_Status_Right";
const TWCNT_Status_Top: string = "TWCNT_Status_Top";
const TWCNT_Auto_Output: string = "TWCNT_Auto_Output";
const TWCNT_Manual_Output: string = "TWCNT_Manual_Output";
const TWCNT_CMD_Setpoint: string = "TWCNT_CMD_Setpoint";
const TWCNT_CMD_Setpoint1: string = "TWCNT_CMD_Setpoint1";
const TWCNT_Detector_max: string = "TWCNT_Detector_max";
const TWCNT_Detector_min: string = "TWCNT_Detector_min";
const TWCNT_Detector: string = "TWCNT_Detector";
const TWСNT_Banopn: string = "TWCNT_Banopn";
const TWCNT_Bancls: string = "TWCNT_Bancls";
const CNT_PWR: string = "CNT_PWR";

const CLOSED_COLOR = "#6bf36b";
const OPENED_COLOR = "#ff1f1f";
const MIDDLE_COLOR = "#ffe11e";
const REPAIR_COLOR = "#808080";
const ORANGE_COLOR = "#FFA500";
const BLUE_COLOR = "#0000FF";
const PURPLE_COLOR = "#9370DB";

const vertical = "VERTICAL";
const verticalReverse = "VERTICAL_REVERSE";

interface ITwcntValveProps {
  block: ITwcntValve;
}

const TwcntValve = ({ block }: ITwcntValveProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const { sendCommand } = useSendCommand(stationCode || "");
  const [hoverState, setHover] = useHoverState();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [chartIconImage, setChartIconImage] = useState(new window.Image());
  const [kvitirovanieIconImage, setCKvitirovanieIconImage] = useState(new window.Image());
  const [repairIconImage, setCRepairIconImage] = useState(new window.Image());
  const [blockingIconImage, setCBlockingIconImage] = useState(new window.Image());
  const [doneIconImage, setDoneIconImage] = useState(new window.Image());
  const [inputValue, setInputValue] = useState("");
  const [inputValueCMD, setInputValueCMD] = useState("");

  const TWCNT_Status_Left_Value = getSampleValue(block.samples, TWCNT_Status_Left);
  const TWCNT_Status_Right_Value = getSampleValue(block.samples, TWCNT_Status_Right);
  const TWCNT_Status_Top_Value = getSampleValue(block.samples, TWCNT_Status_Top);
  const TWCNT_Auto_Output_Value = getSampleValue(block.samples, TWCNT_Auto_Output);
  const TWCNT_Manual_Output_Value = getSampleValue(block.samples, TWCNT_Manual_Output);
  const TWCNT_CMD_Setpoint_Value = getSampleValue(block.samples, TWCNT_CMD_Setpoint);
  const TWCNT_CMD_Setpoint1_Value = getSampleValue(block.samples, TWCNT_CMD_Setpoint1);
  const TWCNT_Detector_max_Value = getSampleValue(block.samples, TWCNT_Detector_max);
  const TWCNT_Detector_min_Value = getSampleValue(block.samples, TWCNT_Detector_min);
  const TWCNT_Detector_Value = getSampleValue(block.samples, TWCNT_Detector);
  const TWCNT_Banopn_Value = getSampleValue(block.samples, TWСNT_Banopn);
  const TWCNT_Bancls_Value = getSampleValue(block.samples, TWCNT_Bancls);
  const CNT_PWR_Value = getSampleValue(block.samples, CNT_PWR);

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

  useEffect(() => {
    setInputValue((TWCNT_CMD_Setpoint_Value * 100).toString());
    setInputValueCMD(TWCNT_CMD_Setpoint1_Value.toString());
  }, [TWCNT_CMD_Setpoint_Value, TWCNT_CMD_Setpoint1_Value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleInputChangeCMD = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueCMD(event.target.value);
  };

  const handleCloseCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bhs", "_fhd");
  };

  const handleOpenCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bhoe", "_fhd");
  };

  const handleAutoCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bha", "_fhd");
  };

  const handleStepBackCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "zdi", "_less", "_fhd");
  };

  const handleStepUpCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "zdi", "_more", "_fhd");
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

  const handleValueCMDCommand = async () => {
    await universalCommandHand(stationCode || "", block.kks, "r_", "_zd", Number(inputValueCMD));
  };

  //   const prevStatusRef = useRef(statusSampleCNT_StatusValue);

  //   useEffect(() => {
  //     prevStatusRef.current = statusSampleCNT_StatusValue;
  //   }, [statusSampleCNT_StatusValue]);

  let leftTriangleColor: string;
  let rightTriangleColor: string;
  let topTriangleColor: string;

  const isLeftOpened = TWCNT_Status_Left_Value >= 0.99;
  const isRightOpened = TWCNT_Status_Right_Value >= 0.99;
  const isTopOpened = TWCNT_Status_Top_Value >= 0.99;

  const isLeftMiddle = TWCNT_Status_Left_Value > 0.01 && TWCNT_Status_Left_Value < 0.99;
  const isRightMiddle = TWCNT_Status_Right_Value > 0.01 && TWCNT_Status_Right_Value < 0.99;
  const isTopMiddle = TWCNT_Status_Top_Value > 0.01 && TWCNT_Status_Top_Value < 0.99;

  leftTriangleColor = isLeftMiddle ? MIDDLE_COLOR : isLeftOpened ? OPENED_COLOR : CLOSED_COLOR;
  rightTriangleColor = isRightMiddle ? MIDDLE_COLOR : isRightOpened ? OPENED_COLOR : CLOSED_COLOR;
  topTriangleColor = isTopMiddle ? MIDDLE_COLOR : isTopOpened ? OPENED_COLOR : CLOSED_COLOR;

  const widthProgressBarOrange =
    ((TWCNT_CMD_Setpoint1_Value - TWCNT_Detector_min_Value) / (TWCNT_Detector_max_Value - TWCNT_Detector_min_Value)) *
    100;

  const widthProgressBarPurple =
    ((TWCNT_Detector_Value - TWCNT_Detector_min_Value) / (TWCNT_Detector_max_Value - TWCNT_Detector_min_Value)) * 100;

  let rotation: number = 0;
  let offsetX: number = 0;
  let offsetY: number = 0;

  if (block.rotate === vertical) {
    rotation = 90;
    offsetX = 2;
    offsetY = -block.prefWidth / 2 - 2;
  } else if (block.rotate === verticalReverse) {
    rotation = 90;
    offsetX = -2;
    offsetY = -20;
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
        onClick={() => setModalVisible(true)}
      >
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
            block.prefWidth / 4.09,
            block.prefWidth / 4.73,

            block.prefWidth / 1.69,
            block.prefWidth / 2.3,

            -block.prefWidth / 9.52,
            block.prefWidth / 2.3,
          ]}
          fill={topTriangleColor}
          stroke="black"
          strokeWidth={1}
          closed
          offsetX={block.prefWidth / 2}
          offsetY={block.prefWidth / 1.4}
        />

        <RegularPolygon
          sides={3}
          radius={block.prefHeight / 4 + 2}
          fill={topTriangleColor}
          offsetX={10}
          offsetY={-12}
          rotation={0}
          stroke="black"
          strokeWidth={1}
        />

        {/* {statusSampleCNT_RepairValue === 1 && (
        <KonvaImage
          image={imageRef.current}
          x={0}
          y={-30}
          width={10}
          height={10}
        />
      )}

      {statusSampleCNT_MFValue === 1 && (
        <Rect
          x={-38}
          y={-34}
          width={50}
          height={50}
          stroke="red"
          strokeWidth={2}
        />
      )} */}
      </Group>

      {isModalVisible && (
        <Portal selector=".top-layer">
          <Group x={window.innerWidth / 2} y={window.innerHeight / 2} draggable>
            <Rect width={225} height={500} stroke="black" strokeWidth={3} cornerRadius={10} />
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

            <Rect x={10} y={150} width={113} height={57} fill="rgb(245, 245, 245)" cornerRadius={10} />

            <Text
              x={10}
              y={150}
              text={customToFixed(TWCNT_Status_Top_Value * 100, 1) + "%"}
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
              y={175}
              sides={3}
              radius={18}
              fill={leftTriangleColor}
              rotation={90}
              stroke="black"
              strokeWidth={1}
            />

            <RegularPolygon
              x={188}
              y={175}
              sides={3}
              radius={18}
              fill={rightTriangleColor}
              offsetX={0}
              rotation={270}
              stroke="black"
              strokeWidth={1}
            />
            <RegularPolygon
              x={169}
              y={195}
              sides={3}
              radius={18}
              fill={topTriangleColor}
              offsetX={0}
              rotation={0}
              stroke="black"
              strokeWidth={1}
            />

            <Line
              points={[147, 160, 169, 140, 192, 160]}
              fill={topTriangleColor}
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
                fill={hoverState.auto ? ORANGE_COLOR : TWCNT_Auto_Output_Value === 0 ? "#F5F5F5" : CLOSED_COLOR}
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
                fill={hoverState.hand ? ORANGE_COLOR : TWCNT_Manual_Output_Value === 0 ? "#F5F5F5" : CLOSED_COLOR}
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
                fill={hoverState.stepBack ? CLOSED_COLOR : REPAIR_COLOR}
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
                fill={hoverState.stepUp ? ORANGE_COLOR : "white"}
                cornerRadius={5}
              />
              <RegularPolygon
                x={188}
                y={225}
                sides={3}
                radius={12}
                fill={hoverState.stepUp ? CLOSED_COLOR : REPAIR_COLOR}
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
                    fontSize: "14px",
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
              <Image image={doneIconImage} x={57} y={0} width={25} height={25} />
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
              width={TWCNT_Status_Top_Value * 100}
              height={15}
              fill={BLUE_COLOR}
              cornerRadius={4}
              stroke="black"
              strokeWidth={1}
            />
            <Text x={102} y={275} text="0" fontSize={12} fill="#F5F5F5" fontFamily="Tahoma" />
            <Text x={148} y={275} text="50" fontSize={12} fill="#F5F5F5" fontFamily="Tahoma" />
            <Text x={198} y={275} text="100" fontSize={12} fill="#F5F5F5" fontFamily="Tahoma" />

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
                    fontSize: "14px",
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
              <Image image={doneIconImage} x={57} y={0} width={25} height={25} />
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
              width={Number(customToFixed(widthProgressBarOrange, 0))}
              height={15}
              fill={ORANGE_COLOR}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={170}
              y={315}
              text={customToFixed(TWCNT_Detector_max_Value, 0)}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
              align="right"
              width={40}
            />
            <Text
              x={100}
              y={315}
              text={customToFixed(TWCNT_Detector_min_Value, 0)}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
              align="left"
              width={40}
            />

            <Rect x={40} y={330} width={55} height={25} fill="rgb(245, 245, 245)" cornerRadius={5} />

            <Text
              x={40}
              y={330}
              text={customToFixed(TWCNT_Detector_Value, 0)}
              fontSize={14}
              fill="#000"
              fontFamily="Tahoma"
              align="center"
              width={55}
              height={25}
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
              width={widthProgressBarPurple || 0}
              height={15}
              fill={PURPLE_COLOR}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={170}
              y={355}
              text={customToFixed(TWCNT_Detector_max_Value, 0)}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
              align="right"
              width={40}
            />
            <Text
              x={100}
              y={355}
              text={customToFixed(TWCNT_Detector_min_Value, 0)}
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
              fill={TWCNT_Banopn_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
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
              fill={TWCNT_Bancls_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
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

export default TwcntValve;
