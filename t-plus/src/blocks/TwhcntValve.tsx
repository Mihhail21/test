import { useState, useEffect } from "react";
import { RegularPolygon, Group, Rect, Text, Line, Image } from "react-konva";
import { Portal, Html } from "react-konva-utils";
import { useParams } from "react-router-dom";
import { ITwhcntValve } from "@/interface";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import doneIcon from "../shared/assets/icons/doneIcon.svg";
import { customToFixed } from "@/shared/utils/customToFixed";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import { universalCommand, universalCommands } from "@/shared/utils/commands";


const CLOSED_COLOR: string = "#6bf36b";
const OPENED_COLOR: string = "#ff1f1f";
const MIDDLE_COLOR: string = "#ffe11e";
const ORANGE_COLOR: string = "#FFA500";

const TWHCNT_Status_Left: string = "TWHCNT_Status_Left";
const TWHCNT_Status_Right: string = "TWHCNT_Status_Right";
const TWHCNT_Status_Top: string = "TWHCNT_Status_Top";
const TWHCNT_Position: string = "TWHCNT_Position";
const TWHCNT_Status: string = "TWHCNT_Status";
const TWHCNT_Time: string = "TWHCNT_Time";

const vertical: string = "VERTICAL";
const verticalReverse: string = "VERTICAL_REVERSE";

interface ITwhcntValveProps {
  block: ITwhcntValve;
}

const TwhcntValve = ({ block }: ITwhcntValveProps) => {
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

  const TWHCNT_Status_Left_Value = getSampleValue(block.samples, TWHCNT_Status_Left);
  const TWHCNT_Status_Right_Value = getSampleValue(block.samples, TWHCNT_Status_Right);
  const TWHCNT_Status_Top_Value = getSampleValue(block.samples, TWHCNT_Status_Top);
  const TWHCNT_Position_Value = getSampleValue(block.samples, TWHCNT_Position);
  const TWHCNT_Status_Value = getSampleValue(block.samples, TWHCNT_Status);
  const TWHCNT_TIME_Value = getSampleValue(block.samples, TWHCNT_Time);

  const changeCursorOnHover = (button: "close" | "open" | "done", isPointer: boolean) => {
    document.body.style.cursor = isPointer ? "pointer" : "default";
    setHoverState((prevState) => ({ ...prevState, [button]: isPointer }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    setInputValue(TWHCNT_Position_Value.toString());
  }, [TWHCNT_Position_Value]);

  const handleCloseCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bhs", "_fhd");
  };

  const handleOpenCommands = async () => {
    await universalCommands(stationCode || "", block.kks, "ycc", "_bhoe", "_fhd");
  };

  const handleValueCommand = async () => {
    await universalCommand(stationCode || "", block.kks, "ypxr", "", Number(inputValue));
  };

  let leftTriangleColor: string;
  let rightTriangleColor: string;
  let topTriangleColor: string;

  const isLeftOpened = TWHCNT_Status_Left_Value >= 0.99;
  const isRightOpened = TWHCNT_Status_Right_Value >= 0.99;
  const isTopOpened = TWHCNT_Status_Top_Value >= 0.99;

  const isLeftMiddle = TWHCNT_Status_Left_Value > 0.01 && TWHCNT_Status_Left_Value < 0.99;
  const isRightMiddle = TWHCNT_Status_Right_Value > 0.01 && TWHCNT_Status_Right_Value < 0.99;
  const isTopMiddle = TWHCNT_Status_Top_Value > 0.01 && TWHCNT_Status_Top_Value < 0.99;

  leftTriangleColor = isLeftMiddle ? MIDDLE_COLOR : isLeftOpened ? OPENED_COLOR : CLOSED_COLOR;
  rightTriangleColor = isRightMiddle ? MIDDLE_COLOR : isRightOpened ? OPENED_COLOR : CLOSED_COLOR;
  topTriangleColor = isTopMiddle ? MIDDLE_COLOR : isTopOpened ? OPENED_COLOR : CLOSED_COLOR;

  if (block.rotate === "HORIZONTAL_REVERSE") {
    [leftTriangleColor, rightTriangleColor] = [rightTriangleColor, leftTriangleColor];
  }

  let rotation: number = 0;
  let offsetX: number = 0;
  let offsetY: number = 0;

  if (block.rotate === vertical) {
    rotation = 90;
    offsetX = -block.prefHeight / 1.28;
    offsetY = block.prefWidth / 2.66;
  } else if (block.rotate === verticalReverse) {
    rotation = 270;
    offsetX = -block.prefHeight / 1.8;
    offsetY = block.prefWidth / 18.5;
  } else {
    rotation = 0;
    offsetX = -block.prefWidth / 1.33;
    offsetY = block.scaleY === -1 ? -block.prefWidth / 4 : -block.prefWidth / 2;
  }

  return (
    <>
      <Group
        x={block.x}
        y={block.y}
        rotation={rotation}
        offsetX={offsetX}
        offsetY={offsetY}
        onClick={() => setModalVisible(true)}
      >
        <RegularPolygon
          sides={3}
          radius={block.prefWidth / 3.33}
          fill={leftTriangleColor}
          offsetX={0}
          offsetY={-block.prefWidth / 1.81}
          rotation={90}
          stroke="black"
          strokeWidth={1}
        />
        <RegularPolygon
          sides={3}
          radius={block.prefWidth / 3.33}
          fill={rightTriangleColor}
          offsetX={0}
          rotation={270}
          stroke="black"
          strokeWidth={1}
        />

        <RegularPolygon
          sides={3}
          radius={block.prefWidth / 3.33}
          fill={topTriangleColor}
          offsetX={block.scaleY !== -1 ? -block.prefWidth / 4 : block.prefWidth / 4}
          offsetY={-block.prefWidth / 3.33}
          rotation={block.scaleY !== -1 ? 180 : 0}
          stroke="black"
          strokeWidth={1}
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
            <Rect x={10} y={105} width={113} height={38 * 1.5} fill="rgb(245, 245, 245)" cornerRadius={10} />
            <Text
              x={10}
              y={105}
              text={customToFixed(TWHCNT_Status_Value * 100, 1) + "%"}
              fontSize={27}
              fill="black"
              fontFamily="Tahoma"
              align="center"
              width={113}
              height={57}
              verticalAlign="middle"
              fontStyle="bold"
            />

            <Rect x={10} y={155} width={113} height={30} fill="rgb(20, 60, 84)" cornerRadius={[0, 0, 5, 5]} />

            <Text
              x={10}
              y={155}
              text={TWHCNT_TIME_Value + " сек"}
              // text={"xxx" + " сек"}
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
              y={120}
              sides={3}
              radius={18}
              fill={leftTriangleColor}
              rotation={90}
              stroke="black"
              strokeWidth={1}
            />

            <RegularPolygon
              x={186}
              y={120}
              sides={3}
              radius={18}
              fill={rightTriangleColor}
              offsetX={0}
              rotation={270}
              stroke="black"
              strokeWidth={1}
            />

            <RegularPolygon
              x={168}
              y={139}
              sides={3}
              radius={18}
              fill={topTriangleColor}
              offsetX={0}
              rotation={0}
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

export default TwhcntValve;
