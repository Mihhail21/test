import { useEffect, useState } from "react";
import { Group, Rect, Text } from "react-konva";
import { useParams } from "react-router-dom";
import { Portal } from "react-konva-utils";
import useSendCommand from "@/shared/api/useSendCommand";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";
import { IInputControl } from "@/interface";

const TXT_Status: string = "TXT_Status";
const ORANGE_COLOR: string = "#FFA500";
interface IInputControlProps {
  block: IInputControl;
}

const InputControl = ({ block }: IInputControlProps) => {
  const [hoverState, setHoverState] = useState({ done: false, close: false });
  const { stationCode } = useParams<{ stationCode: string }>();
  const { sendCommand } = useSendCommand(stationCode || "");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const statusValue = getSampleValue(block.samples, TXT_Status);
  const [inputValue, setInputValue] = useState<string>(statusValue.toFixed(block.decimals).toString());

  const buttons = [
    { id: 1, label: "7", action: "7", x: 10, y: 150, width: 45, height: 45 },
    { id: 2, label: "8", action: "8", x: 60, y: 150, width: 45, height: 45 },
    { id: 3, label: "9", action: "9", x: 110, y: 150, width: 45, height: 45 },
    { id: 4, label: "<-", action: "clear", x: 170, y: 150, width: 45, height: 45 },
    { id: 5, label: "4", action: "4", x: 10, y: 200, width: 45, height: 45 },
    { id: 6, label: "5", action: "5", x: 60, y: 200, width: 45, height: 45 },
    { id: 7, label: "6", action: "6", x: 110, y: 200, width: 45, height: 45 },
    { id: 8, label: "+/-", action: "toggle", x: 170, y: 200, width: 45, height: 45 },
    { id: 9, label: "1", action: "1", x: 10, y: 250, width: 45, height: 45 },
    { id: 10, label: "2", action: "2", x: 60, y: 250, width: 45, height: 45 },
    { id: 11, label: "3", action: "3", x: 110, y: 250, width: 45, height: 45 },
    { id: 12, label: ".", action: ".", x: 170, y: 250, width: 45, height: 45 },
    { id: 13, label: "0", action: "0", x: 10, y: 300, width: 145, height: 45 },
  ];

  useEffect(() => {
    setInputValue(statusValue.toFixed(block.decimals));
  }, [statusValue]);

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setModalVisible(false);
    }
  };

  const handleInput = (value: string) => {
    if (value === "clear") {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (value === "toggle" && inputValue.length <= 8) {
      setInputValue((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
    } else if (value === "." && inputValue.includes(".")) {
      return;
    } else if (inputValue.length + value.length > 7) {
      return;
    } else {
      setInputValue((prev) => prev + value);
    }
  };

  const changeCursorOnHover = (button: "close" | "done", isPointer: boolean) => {
    document.body.style.cursor = isPointer ? "pointer" : "default";
    setHoverState((prevState) => ({ ...prevState, [button]: isPointer }));
  };

  const handleDone = async () => {
    const command = { name: block.kks, value: Number(inputValue) };
    try {
      await sendCommand(command);
    } catch (error) {
      console.error("Ошибка при отправке команды установки:", error);
    }
  };

  return (
    <Group x={block.x} y={block.y} onClick={() => setModalVisible(true)}>
      <Rect width={block.width} height={block.height} fill="white" cornerRadius={3} />
      <Text
        text={statusValue.toFixed(block.decimals)}
        align="center"
        fill="black"
        fontSize={block.fontSize}
        fontFamily={block.fontName}
        wrap="word"
        width={block.width}
        verticalAlign="middle"
        height={block.height}
      />
      {!block.interactive && isModalVisible && (
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
            <CloseButton
              x={195}
              y={12}
              onClick={() => {
                setModalVisible(false);
                setInputValue(statusValue.toFixed(block.decimals));
              }}
            />
            <Text
              text="Описание"
              fontSize={16}
              fill="black"
              fontFamily="Tahoma"
              fontStyle="bold"
              align="center"
              width={195}
              verticalAlign="middle"
              height={51}
            />
            <Rect x={10} y={60} width={113} height={57} fill="rgb(245, 245, 245)" cornerRadius={10} />
            <Text
              x={10}
              y={60}
              text={inputValue}
              fontSize={23}
              fill="black"
              fontFamily="Tahoma"
              align="center"
              width={113}
              height={57}
              verticalAlign="middle"
              fontStyle="bold"
            />
            <Rect x={10} y={110} width={113} height={30} fill="rgb(20, 60, 84)" cornerRadius={[0, 0, 5, 5]} />
            <Text
              x={10}
              y={110}
              text="Ед.изм"
              fontSize={16}
              fill="#FFFFFF"
              fontFamily="Tahoma"
              align="center"
              width={113}
              fontStyle="bold"
              height={30}
              verticalAlign="middle"
            />

            {buttons.map((button) => (
              <Group key={button.id} onClick={() => handleInput(button.action)}>
                <Rect
                  x={button.x}
                  y={button.y}
                  width={button.width}
                  height={button.height}
                  fill="#F5F5F5"
                  cornerRadius={5}
                />
                <Text
                  x={button.x}
                  y={button.y}
                  text={button.label}
                  fontSize={16}
                  fill="black"
                  fontFamily="Tahoma"
                  align="center"
                  width={button.width}
                  height={button.height}
                  verticalAlign="middle"
                  fontStyle="bold"
                />
              </Group>
            ))}
            <Group
              onMouseEnter={() => changeCursorOnHover("done", true)}
              onMouseLeave={() => changeCursorOnHover("done", false)}
              onClick={handleDone}
            >
              <Rect
                x={10}
                y={350}
                width={100}
                height={40}
                fill={hoverState.done ? ORANGE_COLOR : "white"}
                cornerRadius={5}
              />
              <Text
                x={10}
                y={350}
                text="ВВОД"
                fontSize={20}
                fill="black"
                fontFamily="Tahoma"
                align="center"
                width={100}
                height={40}
                verticalAlign="middle"
                fontStyle="bold"
              />
            </Group>

            <Group
              onMouseEnter={() => changeCursorOnHover("close", true)}
              onMouseLeave={() => changeCursorOnHover("close", false)}
              onClick={() => setInputValue("")}
            >
              <Rect
                x={115}
                y={350}
                width={100}
                height={40}
                fill={hoverState.close ? ORANGE_COLOR : "white"}
                cornerRadius={5}
              />
              <Text
                x={115}
                y={350}
                text="ОТМЕНА"
                fontSize={20}
                fill="black"
                fontFamily="Tahoma"
                align="center"
                width={100}
                height={40}
                verticalAlign="middle"
                fontStyle="bold"
              />
            </Group>
          </Group>
        </Portal>
      )}
    </Group>
  );
};

export default InputControl;
