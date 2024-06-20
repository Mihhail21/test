import { useState, useEffect } from "react";
import { RegularPolygon, Group, Circle, Rect, Image, Text, Line } from "react-konva";
import { useParams } from "react-router-dom";
import { Portal } from "react-konva-utils";
import { IPumpControl } from "../interface/shapes/PumpControl";
import kvitirovanieIcon from "../shared/assets/icons/kvitirovanieIcon.svg";
import repairIcon from "../shared/assets/icons/repairIcon.svg";
import blockingIcon from "../shared/assets/icons/blockingIcon.svg";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import ButtonValve from "@/shared/ui/ButtonValve/ButtonValve";
import { universalCommand, universalCommands } from "@/shared/utils/commands";

const CLOSED_COLOR: string = "#6bf36b";
const OPENED_COLOR: string = "#ff1f1f";
const ORANGE_COLOR: string = "#FFA500";
const REPAIR_COLOR: string = "#808080";
const WHITE_COLOR: string = "#FFFAFA";

const PMP_Status: string = "PMP_Status";
const PMP_PWR: string = "PMP_PWR";
const PMP_Repair: string = "PMP_Repair";
const PMP_Banon: string = "PMP_Banon";
const PMP_Banoff: string = "PMP_Banoff";
const PMP_AVR: string = "PMP_AVR";
const PMP_WORK: string = "PMP_Work";

interface IPumpProps {
  block: IPumpControl;
}

const PumpControl = ({ block }: IPumpProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [kvitirovanieIconImage, setCKvitirovanieIconImage] = useState(new window.Image());
  const [repairIconImage, setCRepairIconImage] = useState(new window.Image());
  const [blockingIconImage, setCBlockingIconImage] = useState(new window.Image());
  const [hoverState, setHoverState] = useState({ close: false, open: false, avr: false, work: false });

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
    loadImage(blockingIcon, setCBlockingIconImage);
  }, []);

  const PMP_Status_Value = getSampleValue(block.samples, PMP_Status);
  const PMP_PWR_Value = getSampleValue(block.samples, PMP_PWR);
  const PMP_Repair_Value = getSampleValue(block.samples, PMP_Repair);
  const PMP_Banon_Value = getSampleValue(block.samples, PMP_Banon);
  const PMP_Banoff_Value = getSampleValue(block.samples, PMP_Banoff);
  const PMP_AVR_Value = getSampleValue(block.samples, PMP_AVR);
  const PMP_WORK_Value = getSampleValue(block.samples, PMP_WORK);

  const changeCursorOnHover = (button: "close" | "open" | "avr" | "work", isPointer: boolean) => {
    document.body.style.cursor = isPointer ? "pointer" : "default";
    setHoverState((prevState) => ({ ...prevState, [button]: isPointer }));
  };
  const handleCloseCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bha", "_fhd");
  };

  const handleOpenCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bhe", "_fhd");
  };

  const handleAvrCommand = async () => {
    const value = PMP_AVR_Value === 0 ? 1 : 0;
    await universalCommand(stationCode || "", block.kks, "zdi", "_avr2", value);
  };

  const handleWorkCommand = async () => {
    const value = PMP_WORK_Value === 0 ? 1 : 0;
    await universalCommand(stationCode || "", block.kks, "zdi", "_avr1", value);
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

  let circleColor: string = CLOSED_COLOR;

  if (PMP_Status_Value <= 0.5) {
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

            <Image image={kvitirovanieIconImage} x={7.5} y={105} width={42} height={42} />
            <Image image={repairIconImage} x={57} y={103} width={36} height={36} />
            <Image image={blockingIconImage} x={105} y={103} width={36} height={36} />

            {block.withAVR === "1" && (
              <>
                <Group
                  onMouseEnter={() => changeCursorOnHover("avr", true)}
                  onMouseLeave={() => changeCursorOnHover("avr", false)}
                  onClick={handleAvrCommand}
                >
                  <Rect
                    x={50}
                    y={160}
                    width={55}
                    height={25}
                    fill={hoverState.avr ? ORANGE_COLOR : PMP_AVR_Value === 0 ? WHITE_COLOR : CLOSED_COLOR}
                    cornerRadius={5}
                    stroke="black"
                    strokeWidth={1}
                  />
                  <Text
                    x={50}
                    y={160}
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
                  onMouseEnter={() => changeCursorOnHover("work", true)}
                  onMouseLeave={() => changeCursorOnHover("work", false)}
                  onClick={handleWorkCommand}
                >
                  <Rect
                    x={50}
                    y={190}
                    width={55}
                    height={25}
                    fill={hoverState.work ? ORANGE_COLOR : PMP_WORK_Value === 0 ? WHITE_COLOR : CLOSED_COLOR}
                    cornerRadius={5}
                    stroke="black"
                    strokeWidth={1}
                  />
                  <Text
                    x={50}
                    y={190}
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
              </>
            )}

            <Circle
              x={block.withAVR === "1" ? 160 : 110}
              y={188}
              radius={40}
              fill={circleColor}
              stroke="black"
              strokeWidth={1}
            />
            <RegularPolygon
              x={block.withAVR === "1" ? 168 : 118}
              y={188}
              sides={3}
              radius={25}
              fill="black"
              stroke="black"
              rotation={90}
              strokeWidth={1}
            />
            <Rect
              x={25}
              y={255}
              width={175}
              height={20}
              fill={PMP_Banon_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={25}
              y={255}
              text="Запрет ВКЛ"
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
              fill={PMP_Banoff_Value === 0 ? OPENED_COLOR : "#F5F5F5"}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={25}
              y={285}
              width={175}
              text="Запрет ОТКЛ"
              fontSize={16}
              fill="#000"
              fontFamily="Tahoma"
              align="center"
              height={20}
              fontStyle="bold"
              verticalAlign="middle"
            />
            <Rect
              x={25}
              y={315}
              width={175}
              height={20}
              // fill={statusSampleSOL_PWRValue === 1 ? "#F5F5F5" : OPENED_COLOR}
              fill="#F5F5F5"
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
            <ButtonValve
              x={35}
              y={350}
              text={"ОТКЛ"}
              onMouseEnter={() => changeCursorOnHover("close", true)}
              onMouseLeave={() => changeCursorOnHover("close", false)}
              onClick={handleCloseCommands}
              hoverState={hoverState.close}
            />
            <ButtonValve
              x={120}
              y={350}
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

export default PumpControl;
