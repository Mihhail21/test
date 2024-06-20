import { useState, useEffect } from "react";
import { RegularPolygon, Group, Circle, Rect, Image, Text, Line } from "react-konva";
import { useParams } from "react-router-dom";
import { Portal, Html } from "react-konva-utils";
import { IPumpControlPMK } from "@/interface";
import useSendCommand from "@/shared/api/useSendCommand";
import useHoverState from "@/shared/model/useHoverState";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import { customToFixed } from "@/shared/utils/customToFixed";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import kvitirovanieIcon from "../shared/assets/icons/kvitirovanieIcon.svg";
import repairIcon from "../shared/assets/icons/repairIcon.svg";
import blockingIcon from "../shared/assets/icons/blockingIcon.svg";
import chartIcon from "../shared/assets/icons/chartIcon.svg";
import doneIcon from "../shared/assets/icons/doneIcon.svg";
import { universalCommand, universalCommands } from "@/shared/utils/commands";

const CLOSED_COLOR: string = "#6bf36b";
const OPENED_COLOR: string = "#ff1f1f";
const REPAIR_COLOR: string = "#808080";
const ORANGE_COLOR: string = "#FFA500";
const BLUE_COLOR: string = "#0000FF";
const PURPLE_COLOR: string = "#9370DB";
const WHITE_COLOR: string = "#FFFAFA";

const PMK_Status: string = "PMK_Status";
const PMK_PWR: string = "PMK_PWR";
const PMK_Repair: string = "PMK_Repair";
const PMK_Banon: string = "PMK_Banon";
const PMK_Banoff: string = "PMK_Banoff";
const PMK_AVR: string = "PMK_AVR";
const PMK_WORK: string = "PMK_Work";
const PMK_Chrplmp: string = "PMK_Chrplmp";
const PMK_Auto: string = "PMK_Auto_OutputWeb";
const PMK_Manual: string = "PMK_Manual_OutputWeb";
const PMK_CMD_SetpointWeb: string = "PMK_CMD_SetpointWeb";
const PMK_Setpoint_OutputWeb: string = "PMK_Setpoint_OutputWeb";
const PMK_Detector_max: string = "PMK_Detector_max";
const PMK_Detector_min: string = "PMK_Detector_min";
const PMK_Detector_web: string = "PMK_Detector_web";

interface IPumpProps {
  block: IPumpControlPMK;
}

const PumpControlPMK = ({ block }: IPumpProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const { sendCommand } = useSendCommand(stationCode || "");
  const [hoverState, setHover] = useHoverState();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [kvitirovanieIconImage, setCKvitirovanieIconImage] = useState(new window.Image());
  const [repairIconImage, setCRepairIconImage] = useState(new window.Image());
  const [chartIconImage, setChartIconImage] = useState(new window.Image());
  const [blockingIconImage, setCBlockingIconImage] = useState(new window.Image());
  const [doneIconImage, setDoneIconImage] = useState(new window.Image());
  const [inputValue, setInputValue] = useState("");
  const [inputValueCMD, setInputValueCMD] = useState("");

  useEffect(() => {
    const loadImage = (src: string, setImage: React.Dispatch<React.SetStateAction<HTMLImageElement>>) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setImage(img);
      };
    };
    loadImage(kvitirovanieIcon, setCKvitirovanieIconImage);
    loadImage(repairIcon, setCRepairIconImage);
    loadImage(chartIcon, setChartIconImage);
    loadImage(blockingIcon, setCBlockingIconImage);
    loadImage(doneIcon, setDoneIconImage);
  }, []);

  const PMK_Status_Value = getSampleValue(block.samples, PMK_Status);
  const PMK_PWR_Value = getSampleValue(block.samples, PMK_PWR);
  const PMK_Repair_Value = getSampleValue(block.samples, PMK_Repair);
  const PMK_Banon_Value = getSampleValue(block.samples, PMK_Banon);
  const PMK_Banoff_Value = getSampleValue(block.samples, PMK_Banoff);
  const PMK_AVR_Value = getSampleValue(block.samples, PMK_AVR);
  const PMK_WORK_Value = getSampleValue(block.samples, PMK_WORK);
  const PMK_Chrplmp_Value = getSampleValue(block.samples, PMK_Chrplmp);
  const PMK_Auto_Value = getSampleValue(block.samples, PMK_Auto);
  const PMK_Manual_Value = getSampleValue(block.samples, PMK_Manual);
  const PMK_CMD_SetpointWeb_Value = getSampleValue(block.samples, PMK_CMD_SetpointWeb);
  const PMK_Setpoint_OutputWeb_Value = getSampleValue(block.samples, PMK_Setpoint_OutputWeb);
  const PMK_Detector_min_Value = getSampleValue(block.samples, PMK_Detector_min);
  const PMK_Detector_max_Value = getSampleValue(block.samples, PMK_Detector_max);
  const PMK_Detector_web_Value = getSampleValue(block.samples, PMK_Detector_web);

  const widthProgressBarDetectorOrange =
    ((PMK_Setpoint_OutputWeb_Value - PMK_Detector_min_Value) / (PMK_Detector_max_Value - PMK_Detector_min_Value)) * 120;

  const widthProgressBarDetectorPurple =
    ((PMK_Detector_web_Value - PMK_Detector_min_Value) / (PMK_Detector_max_Value - PMK_Detector_min_Value)) * 120;

  useEffect(() => {
    setInputValue((PMK_CMD_SetpointWeb_Value * 100).toString());
    setInputValueCMD(customToFixed(PMK_Setpoint_OutputWeb_Value, 0));
  }, [PMK_CMD_SetpointWeb_Value, PMK_Setpoint_OutputWeb_Value]);

  const handleMouseEnter = (key: keyof typeof hoverState) => {
    setHover(key, true);
    document.body.style.cursor = "pointer";
  };

  const handleMouseLeave = (key: keyof typeof hoverState) => {
    setHover(key, false);
    document.body.style.cursor = "default";
  };

  const handleCloseCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bha", "_fhd");
  };

  const handleOpenCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bhe", "_fhd");
  };

  const handleAvrCommand = async () => {
    const value = PMK_AVR_Value === 0 ? 1 : 0;
    await universalCommand(stationCode || "", block.kks, "zdi", "_avr2", value);
  };

  const handleWorkCommand = async () => {
    const value = PMK_WORK_Value === 0 ? 1 : 0;
    await universalCommand(stationCode || "", block.kks, "zdi", "_avr1", value);
  };

  const handleAutoCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "yccreg_", "_bha", "_fhd");
  };

  const sendStepBackCommands = async () => {
    const commands = [
      { name: `yccreg_${block.kks}_bhs`, value: 1 },
      { name: `yccreg_${block.kks}_bhs`, value: 0 },
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

  const sendStepUpCommands = async () => {
    const commands = [
      { name: `yccreg_${block.kks}_bhoe`, value: 1 },
      { name: `yccreg_${block.kks}_bhoe`, value: 0 },
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
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleInputChangeCMD = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueCMD(event.target.value);
  };

  const sendValueCommands = async () => {
    const updateValue = Number(inputValue) * 0.01;
    const command = { name: `r_reg_${block.kks}_zd`, value: updateValue };

    try {
      await sendCommand(command);
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  const sendValueCMDCommands = async () => {
    const command = { name: `r_reg_${block.kks}_zai`, value: Number(inputValueCMD) };
    try {
      await sendCommand(command);
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  let rotation: number;
  switch (block.rotate) {
    case "HORIZONTAL_REVERSE":
      rotation = 270;
      break;
    case "HORIZONTAL":
      rotation = 90;
      break;
    case "VERTICAL":
      rotation = 180;
      break;
    case "VERTICAL_REVERSE":
      rotation = 0;
      break;
    default:
      rotation = 0;
      break;
  }

  let circleColor = CLOSED_COLOR;

  if (PMK_Status_Value <= 0.03) {
    circleColor = CLOSED_COLOR;
  } else {
    circleColor = OPENED_COLOR;
  }

  return (
    <>
      <Group
        x={block.x + block.prefHeight / 2}
        y={block.y + block.prefWidth / 2}
        rotation={rotation}
        onClick={() => setModalVisible(true)}
      >
        <Circle radius={block.prefHeight / 2} fill={circleColor} stroke="black" strokeWidth={1} />
        <RegularPolygon
          sides={3}
          radius={block.prefHeight / 3}
          fill="black"
          offsetX={0}
          offsetY={block.prefHeight / 10}
          stroke="black"
          strokeWidth={1}
        />
      </Group>
      {isModalVisible && (
        <Portal selector=".top-layer">
          <Group x={window.innerWidth / 2} y={window.innerHeight / 2} draggable>
            <Rect width={450} height={400} stroke="black" strokeWidth={3} cornerRadius={10} />
            <Rect
              width={450}
              height={400}
              fill="rgb(101, 116, 128)"
              stroke="rgb(185, 185, 185)"
              strokeWidth={1}
              cornerRadius={10}
            />

            <Rect
              width={450}
              height={51}
              fill="rgb(245, 245, 245)"
              stroke="rgb(185, 185, 185)"
              strokeWidth={1}
              cornerRadius={[10, 10, 0, 0]}
            />

            <CloseButton x={420} y={12} onClick={() => setModalVisible(false)} />
            <Text
              text={block.kks}
              fontSize={16}
              fill="black"
              fontFamily="Tahoma"
              fontStyle="bold"
              align="center"
              width={420}
              verticalAlign="middle"
              height={34 * 1.5}
            />
            <Text
              y={51}
              text={block.description || "пока нет данных"}
              fontSize={14}
              fill="#fff"
              fontFamily="Tahoma"
              align="center"
              width={450}
              verticalAlign="middle"
              height={38}
            />

            <Line points={[0, 90, 450, 90]} stroke="rgb(185, 185, 185)" strokeWidth={2} />
            <Line points={[225, 90, 225, 400]} stroke="rgb(185, 185, 185)" strokeWidth={2} />

            <Image image={chartIconImage} x={7.5} y={105} width={33} height={33} />
            <Image image={kvitirovanieIconImage} x={45} y={105} width={42} height={42} />
            <Image image={repairIconImage} x={90} y={103} width={36} height={36} />
            <Image image={blockingIconImage} x={135} y={103} width={36} height={36} />

            <Group
              onMouseEnter={() => handleMouseEnter("avr")}
              onMouseLeave={() => handleMouseLeave("avr")}
              onClick={handleAvrCommand}
            >
              <Rect
                x={40}
                y={165}
                width={55}
                height={25}
                fill={hoverState.avr ? ORANGE_COLOR : PMK_AVR_Value === 0 ? WHITE_COLOR : CLOSED_COLOR}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={40}
                y={165}
                text="АВР"
                fontSize={16}
                fill="#000"
                fontFamily="Tahoma"
                align="center"
                width={55}
                height={25}
                fontStyle="bold"
                verticalAlign="middle"
              />
            </Group>
            <Group
              onMouseEnter={() => handleMouseEnter("work")}
              onMouseLeave={() => handleMouseLeave("work")}
              onClick={handleWorkCommand}
            >
              <Rect
                x={40}
                y={195}
                width={55}
                height={25}
                fill={hoverState.work ? ORANGE_COLOR : PMK_WORK_Value === 0 ? WHITE_COLOR : CLOSED_COLOR}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={40}
                y={195}
                text="РАБ"
                fontSize={16}
                fill="#000"
                fontFamily="Tahoma"
                align="center"
                width={55}
                height={25}
                fontStyle="bold"
                verticalAlign="middle"
              />
            </Group>

            <Circle x={160} y={190} radius={40} fill={circleColor} stroke="black" strokeWidth={1} />
            <RegularPolygon
              x={170}
              y={190}
              sides={3}
              radius={25}
              fill="black"
              stroke="black"
              rotation={90}
              strokeWidth={1}
            />
            <Rect
              x={15}
              y={255}
              width={200}
              height={20}
              fill={PMK_Banon_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={15}
              y={255}
              text="Запрет ВКЛЮЧЕНИЯ"
              fontSize={16}
              fill="#000"
              fontFamily="Tahoma"
              align="center"
              width={200}
              height={20}
              fontStyle="bold"
              verticalAlign="middle"
            />
            <Rect
              x={15}
              y={285}
              width={200}
              height={20}
              fill={PMK_Banoff_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={15}
              y={285}
              width={200}
              text="Запрет ОТКЛЮЧЕНИЯ"
              fontSize={16}
              fill="#000"
              fontFamily="Tahoma"
              align="center"
              height={20}
              fontStyle="bold"
              verticalAlign="middle"
            />
            <Rect
              x={15}
              y={315}
              width={200}
              height={20}
              // fill={statusSampleSOL_PWRValue === 1 ? "#F5F5F5" : OPENED_COLOR}
              fill="#F5F5F5"
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={15}
              y={315}
              text="Управление"
              fontSize={16}
              fill="#000"
              fontFamily="Tahoma"
              align="center"
              width={200}
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
                y={350}
                width={65}
                height={30}
                fill={hoverState.close ? ORANGE_COLOR : WHITE_COLOR}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={35}
                y={350}
                text="ОТКЛ"
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
                y={350}
                width={65}
                height={30}
                fill={hoverState.open ? ORANGE_COLOR : WHITE_COLOR}
                cornerRadius={5}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={120}
                y={350}
                width={65}
                height={30}
                text="ВКЛ"
                fontSize={16}
                fill="#000"
                fontFamily="Tahoma"
                align="center"
                fontStyle="bold"
                verticalAlign="middle"
              />
            </Group>

            {/*  правая часть  */}
            <Rect x={230} y={105} width={85} height={55} fill="rgb(245, 245, 245)" cornerRadius={10} />

            <Text
              x={230}
              y={105}
              text={customToFixed(PMK_Status_Value * 100, 2) + "%"}
              fontSize={20}
              fill="black"
              fontFamily="Tahoma"
              align="center"
              width={85}
              height={55}
              verticalAlign="middle"
              fontStyle="bold"
            />

            <Group
              onMouseEnter={() => handleMouseEnter("auto")}
              onMouseLeave={() => handleMouseLeave("auto")}
              onClick={handleAutoCommands}
            >
              <Rect
                x={320}
                y={105}
                width={50}
                height={25}
                fill={hoverState.auto ? ORANGE_COLOR : PMK_Auto_Value === 0 ? WHITE_COLOR : CLOSED_COLOR}
                cornerRadius={5}
              />
              <Text
                x={320}
                y={105}
                width={50}
                height={25}
                text="АВТ"
                fontSize={18}
                fill="black"
                fontFamily="Tahoma"
                align="center"
                verticalAlign="middle"
                fontStyle="bold"
              />
            </Group>
            <Group
              onMouseEnter={() => handleMouseEnter("hand")}
              onMouseLeave={() => handleMouseLeave("hand")}
              onClick={handleAutoCommands}
            >
              <Rect
                x={320}
                y={135}
                width={50}
                height={25}
                fill={hoverState.hand ? ORANGE_COLOR : PMK_Manual_Value === 0 ? WHITE_COLOR : CLOSED_COLOR}
                cornerRadius={5}
              />
              <Text
                x={320}
                y={135}
                width={50}
                height={25}
                text="РУЧ"
                fontSize={18}
                fill="black"
                fontFamily="Tahoma"
                align="center"
                verticalAlign="middle"
                fontStyle="bold"
              />
            </Group>

            <Rect
              x={386}
              y={105}
              width={50}
              height={25}
              fill={PMK_Chrplmp_Value === 0 ? WHITE_COLOR : CLOSED_COLOR}
              cornerRadius={5}
            />
            <Text
              x={386}
              y={105}
              width={50}
              height={25}
              text="ЧРП"
              fontSize={18}
              fill="black"
              fontFamily="Tahoma"
              align="center"
              verticalAlign="middle"
              fontStyle="bold"
            />

            <Group
              onMouseEnter={() => handleMouseEnter("stepBack")}
              onMouseLeave={() => handleMouseLeave("stepBack")}
              onClick={sendStepBackCommands}
            >
              <Rect
                x={380}
                y={135}
                width={30}
                height={25}
                fill={hoverState.stepBack ? ORANGE_COLOR : WHITE_COLOR}
                cornerRadius={5}
              />

              <RegularPolygon
                x={398}
                y={148}
                sides={3}
                radius={11}
                fill={hoverState.stepBack ? CLOSED_COLOR : "gray"}
                rotation={270}
              />
            </Group>
            <Group
              onMouseEnter={() => handleMouseEnter("stepUp")}
              onMouseLeave={() => handleMouseLeave("stepUp")}
              onClick={sendStepUpCommands}
            >
              <Rect
                x={413}
                y={135}
                width={30}
                height={25}
                fill={hoverState.stepUp ? ORANGE_COLOR : WHITE_COLOR}
                cornerRadius={5}
              />
              <RegularPolygon
                x={426}
                y={148}
                sides={3}
                radius={11}
                fill={hoverState.stepUp ? CLOSED_COLOR : "gray"}
                rotation={90}
              />
            </Group>

            <Group
              x={232}
              y={200}
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
                x={53}
                y={0}
                width={30}
                height={25}
                fill={hoverState.done1 ? ORANGE_COLOR : WHITE_COLOR}
                cornerRadius={5}
              />
              <Image image={doneIconImage} x={55} y={0} width={25} height={25} />
            </Group>

            <Rect
              x={320}
              y={205}
              width={120}
              height={15}
              fill="rgb(245, 245, 245)"
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Rect
              x={320}
              y={205}
              width={PMK_Status_Value * 120}
              height={15}
              fill={BLUE_COLOR}
              cornerRadius={4}
              stroke="black"
              strokeWidth={1}
            />
            <Text x={320} y={230} text="0" fontSize={12} fill="#F5F5F5" fontFamily="Tahoma" />
            <Text x={370} y={230} text="50" fontSize={12} fill="#F5F5F5" fontFamily="Tahoma" />
            <Text x={425} y={230} text="100" fontSize={12} fill="#F5F5F5" fontFamily="Tahoma" />

            <Group
              x={232}
              y={260}
              onMouseEnter={() => handleMouseEnter("done2")}
              onMouseLeave={() => handleMouseLeave("done2")}
              onClick={sendValueCMDCommands}
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
                x={53}
                y={0}
                width={30}
                height={25}
                fill={hoverState.done2 ? ORANGE_COLOR : WHITE_COLOR}
                cornerRadius={5}
              />
              <Image image={doneIconImage} x={55} y={0} width={25} height={25} />
            </Group>

            <Rect
              x={320}
              y={265}
              width={120}
              height={15}
              fill="rgb(245, 245, 245)"
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Rect
              x={320}
              y={265}
              width={widthProgressBarDetectorOrange || 0}
              height={15}
              fill={ORANGE_COLOR}
              cornerRadius={4}
              stroke="black"
              strokeWidth={1}
            />

            <Text
              x={320}
              y={285}
              text={PMK_Detector_min_Value.toString()}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
            />

            <Text
              x={430}
              y={285}
              text={PMK_Detector_max_Value.toString()}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
            />

            <Rect x={265} y={310} width={50} height={25} fill="rgb(245, 245, 245)" cornerRadius={5} />
            <Text
              x={265}
              y={310}
              width={50}
              height={25}
              text={customToFixed(PMK_Detector_web_Value, 0)}
              fontSize={15}
              fill="black"
              fontFamily="Tahoma"
              align="center"
              verticalAlign="middle"
            />
            <Text x={227} y={318} text="Парам." fontSize={11} fill="white" fontFamily="Tahoma" />

            <Rect
              x={320}
              y={315}
              width={120}
              height={15}
              fill="rgb(245, 245, 245)"
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Rect
              x={320}
              y={315}
              width={widthProgressBarDetectorPurple || 0}
              height={15}
              fill={PURPLE_COLOR}
              cornerRadius={4}
              stroke="black"
              strokeWidth={1}
            />

            <Text
              x={320}
              y={335}
              text={PMK_Detector_min_Value.toString()}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
            />
            <Text
              x={430}
              y={335}
              text={PMK_Detector_max_Value.toString()}
              fontSize={12}
              fill="#F5F5F5"
              fontFamily="Tahoma"
            />
          </Group>
        </Portal>
      )}
    </>
  );
};

export default PumpControlPMK;
