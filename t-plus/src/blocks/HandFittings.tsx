import { useEffect, useState } from "react";
import { RegularPolygon, Group, Rect, Image, Line, Text } from "react-konva";
import { Portal, Html } from "react-konva-utils";
import { useParams } from "react-router-dom";
import { IHandFittings } from "../interface";
import doneIcon from "../shared/assets/icons/doneIcon.svg";
import { customToFixed } from "@/shared/utils/customToFixed";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import { universalCommand } from "@/shared/utils/commands";


const CLOSED_COLOR: string = "#69e169";
const OPENED_COLOR: string = "#ff1e1e";
const ORANGE_COLOR: string = "#FFA500";
const VLV_Status: string = "VLV_Status";
const VLV_MF: string = "VLV_MF";
const VLV_Repair: string = "VLV_Repair";
const VLV_Position: string = "VLV_Position";
const VLV_Time: string = "VLV_Time";
const vertical: string = "VERTICAL";
const verticalReverse: string = "VERTICAL_REVERSE";

interface IHandFittingsProps {
  block: IHandFittings;
}

const HandFittings = ({ block }: IHandFittingsProps) => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [doneIconImage, setDoneIconImage] = useState(new window.Image());
  const [hoverState, setHoverState] = useState({ close: false, open: false, done: false });
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const loadImage = (src: string, setImage: React.Dispatch<React.SetStateAction<HTMLImageElement>>) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setImage(img);
      };
    };
    loadImage(doneIcon, setDoneIconImage);
  }, []);

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const VLV_Status_Value = getSampleValue(block.samples, VLV_Status);
  const VLV_MF_Value = getSampleValue(block.samples, VLV_MF);
  const VLV_Repair_Value = getSampleValue(block.samples, VLV_Repair);
  const VLV_Position_Value = getSampleValue(block.samples, VLV_Position);
  const VLV_Time_Value = getSampleValue(block.samples, VLV_Time);

  useEffect(() => {
    setInputValue(VLV_Position_Value.toString());
  }, [VLV_Position_Value]);

  const changeCursorOnHover = (button: "close" | "open" | "done", isPointer: boolean) => {
    document.body.style.cursor = isPointer ? "pointer" : "default";
    setHoverState((prevState) => ({ ...prevState, [button]: isPointer }));
  };

  const handleCloseCommand = async () => {
    await universalCommand(stationCode || "", block.kks, "ypxr", "", 0);
  };

  const handleOpenCommand = async () => {
    await universalCommand(stationCode || "", block.kks, "ypxr", "", 100);
  };
  const handleValueCommand = async () => {
    await universalCommand(stationCode || "", block.kks, "ypxr", "", Number(inputValue));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  let leftTriangleColor = CLOSED_COLOR;
  let rightTriangleColor = OPENED_COLOR;
  if (VLV_Status_Value <= 0.01) {
    leftTriangleColor = CLOSED_COLOR;
    rightTriangleColor = CLOSED_COLOR;
  } else if (VLV_Status_Value >= 0.99) {
    leftTriangleColor = OPENED_COLOR;
    rightTriangleColor = OPENED_COLOR;
  } else if (VLV_Status_Value > 0.01 && VLV_Status_Value < 0.99) {
    leftTriangleColor = CLOSED_COLOR;
    rightTriangleColor = OPENED_COLOR;
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
    offsetX = -block.prefHeight / 1.5;
    offsetY = block.prefWidth / 2;
  } else {
    rotation = 0;
    offsetX = block.prefWidth / 5;
    offsetY = 0;
  }

  return (
    <>
      <Group
        x={block.x + block.prefWidth}
        y={block.y + block.prefHeight / 2}
        rotation={rotation}
        offsetX={offsetX}
        offsetY={offsetY}
        width={block.prefWidth}
        height={block.prefHeight}
        onClick={() => setModalVisible(true)}
        // onClick={() => setModalVisible(true)}
      >


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


<Rect
          x={-block.prefWidth / 1.5}
          y={-block.prefHeight/2}
          width={block.prefWidth}
          height={block.prefHeight}
          opacity={1}

  //  fill="red"
          onClick={() => setModalVisible(true)}
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
              height={34 * 1.5}
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
            <Rect x={7.5} y={105} width={113} height={57} fill="rgb(245, 245, 245)" cornerRadius={10} />
            <Text
              x={10}
              y={105}
              text={customToFixed(VLV_Status_Value * 100, 1) + "%"}
              fontSize={27}
              fill="black"
              fontFamily="Tahoma"
              align="center"
              width={113}
              height={57}
              verticalAlign="middle"
              fontStyle="bold"
            />

            <Rect x={7.5} y={155} width={113} height={30} fill="rgb(20, 60, 84)" cornerRadius={[0, 0, 5, 5]} />

            <Text
              x={10}
              y={155}
              text={VLV_Time_Value + " сек"}
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
              y={130}
              sides={3}
              radius={20}
              fill={leftTriangleColor}
              rotation={90}
              stroke="black"
              strokeWidth={1}
            />

            <RegularPolygon
              x={188}
              y={130}
              sides={3}
              radius={20}
              fill={rightTriangleColor}
              offsetX={0}
              rotation={270}
              stroke="black"
              strokeWidth={1}
            />

            <Group
              x={130}
              y={160}
              onMouseEnter={() => changeCursorOnHover("done", true)}
              onMouseLeave={() => changeCursorOnHover("done", false)}
              onClick={handleValueCommand}
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
                fill={hoverState.done ? ORANGE_COLOR : "white"}
                cornerRadius={5}
              />
              <Image image={doneIconImage} x={57} y={0} width={25} height={25} />
            </Group>

            <Group
              onMouseEnter={() => changeCursorOnHover("close", true)}
              onMouseLeave={() => changeCursorOnHover("close", false)}
              onClick={handleCloseCommand}
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
              onClick={handleOpenCommand}
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

export default HandFittings;
