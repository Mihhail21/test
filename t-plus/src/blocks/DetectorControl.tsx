import { useEffect, useState } from "react";
import { Rect, Text, Group, Image, Line } from "react-konva";
import { Portal, Html, useImage } from "react-konva-utils";
import { IDetectorControl } from "@/interface/shapes/DetectorControl";
import { getSampleValue } from "@/shared/utils/getSampleValue";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";

import chartIcon from "../shared/assets/icons/chartIcon.svg";
import Graph from "./Graph";

interface IDetectorControlProps {
  block: IDetectorControl;
}
const DET_Status: string = "DET_Status";
const DET_max: string = "DET_max";
const DET_min: string = "DET_min";

const EXTRA: number = 4;
const defaultprogressBarHeight: number = 180;

const DetectorControl = ({ block }: IDetectorControlProps) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isChartVisible, setChartVisible] = useState<boolean>(false);
  const [chart] = useImage(chartIcon);

  const [dataValue1, setDataValue1] = useState(0);
  const [dataValue2, setDataValue2] = useState(0);

  useEffect(() => {
    const updateValues = () => {
      const randomValue1 = Math.floor(Math.random() * 100);
      const randomValue2 = Math.floor(Math.random() * 100);
      setDataValue1(randomValue1);
      setDataValue2(randomValue2);
    };

    const interval = setInterval(updateValues, 1000);
    return () => clearInterval(interval);
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

  const DET_Status_Value = getSampleValue(block.samples, DET_Status);
  const DET_max_Value = getSampleValue(block.samples, DET_max);
  const DET_min_Value = getSampleValue(block.samples, DET_min);

  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d");
  if (!canvasContext) {
    return null;
  }
  canvasContext.font = `${block.height / 2}px Tahoma`;
  const paramWidth = canvasContext.measureText(block.param + " ").width;
  const valueWidth = canvasContext.measureText(
    (DET_max_Value === 0 ? DET_min_Value : DET_max_Value).toFixed(
      block.decimals
    ) + " "
  ).width;
  const unitWidth = canvasContext.measureText(block.unit + " " || "").width;

  let progressBarHeight =
    ((DET_Status_Value * 100) /
      (DET_max_Value === 0 ? Math.abs(DET_min_Value) : DET_max_Value)) *
    defaultprogressBarHeight *
    0.01;

  if (Math.abs(DET_max_Value) === Math.abs(DET_min_Value)) {
    progressBarHeight = defaultprogressBarHeight / 2 + progressBarHeight / 2;
  } else {
    progressBarHeight =
      ((DET_Status_Value - DET_min_Value) / (DET_max_Value - DET_min_Value)) *
      defaultprogressBarHeight;
  }

  return (
    <>
      <Group onClick={() => setModalVisible(true)}>
        {/* first block */}
        <Rect
          x={block.x}
          y={block.y + EXTRA}
          width={paramWidth}
          height={block.height - EXTRA * 2}
          fill="black"
          stroke="white"
          strokeWidth={1}
        />
        <Text
          x={block.x}
          y={block.y + block.height / 4 + EXTRA / 2}
          text={block.param}
          fontSize={block.height / 2}
          fill="white"
          fontFamily="Tahoma"
          width={paramWidth}
          align="center"
        />
        {/* second block*/}
        <Rect
          x={block.x + paramWidth}
          y={block.y + 4}
          width={valueWidth}
          height={block.height - EXTRA * 2}
          fill="white"
          stroke="white"
          strokeWidth={1}
        />
        <Text
          x={block.x + paramWidth}
          y={block.y + block.height / 4 + EXTRA / 2}
          text={DET_Status_Value.toFixed(block.decimals)}
          fontSize={block.height / 2 - 1}
          fill="black"
          align="center"
          width={valueWidth}
          fontFamily="Tahoma"
        />
        {/* third  block*/}
        <Rect
          x={block.x + paramWidth + valueWidth}
          y={block.y + 4}
          width={unitWidth}
          height={block.height - EXTRA * 2}
          fill="black"
          stroke="white"
          strokeWidth={1}
        />
        <Text
          x={block.x + paramWidth + valueWidth}
          y={block.y + block.height / 4 + EXTRA / 2}
          text={block.unit || ""}
          fontSize={block.height / 2}
          fill="white"
          fontFamily="Tahoma"
          align="center"
          width={unitWidth}
        />
      </Group>
      {isModalVisible && (
        <Portal selector=".top-layer">
          <Group x={window.innerWidth / 2} y={window.innerHeight / 2} draggable>
            <Rect
              width={225}
              height={285}
              stroke="black"
              strokeWidth={2}
              cornerRadius={10}
            />
            <Rect
              width={225}
              height={285}
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
                setChartVisible(!isChartVisible);
              }}
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
              text={block.tooltipText}
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
              image={chart}
              x={15}
              y={105}
              width={33}
              height={33}
              onClick={() => setChartVisible(!isChartVisible)}
            />

            {isChartVisible && (
              <Html>
                <div style={{ position: "absolute", top: 50, left: 250 }}>
                  <Graph
                    dataValue1={dataValue1}
                    dataValue2={dataValue2}
                    maxValue={100}
                    minValue={0}
                    onClose={() => setChartVisible(false)}
                  />
                </div>
              </Html>
            )}

            <Rect
              x={10}
              y={150}
              width={112}
              height={57}
              fill="rgb(245, 245, 245)"
              cornerRadius={[5, 5, 0, 0]}
            />

            <Text
              x={10}
              y={150}
              text={DET_Status_Value.toFixed(block.decimals)}
              fontSize={27}
              fill="black"
              fontFamily="Tahoma"
              align="center"
              width={112}
              height={57}
              verticalAlign="middle"
              fontStyle="bold"
            />
            <Line
              points={[10, 207, 120, 207]}
              stroke="rgb(185, 185, 185)"
              strokeWidth={2}
            />

            <Rect
              x={10}
              y={208}
              width={112}
              height={30}
              fill="rgb(20, 60, 84)"
              cornerRadius={[0, 0, 5, 5]}
            />

            <Text
              x={10}
              y={208}
              text={block.unit || ""}
              fontSize={18}
              fill="#FFFFFF"
              fontFamily="Tahoma"
              align="center"
              width={112}
              fontStyle="bold"
              height={30}
              verticalAlign="middle"
            />
            <Rect
              x={202}
              y={277}
              width={11}
              height={180}
              fill="#FFFFFF"
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
              rotation={180}
            />

            <Rect
              x={202}
              y={277}
              width={11}
              height={progressBarHeight || 0}
              fill="#2ED158"
              cornerRadius={4}
              stroke="black"
              strokeWidth={1}
              rotation={180}
            />

            <Text
              x={112}
              y={97}
              text={DET_max_Value.toString()}
              fontSize={10.5}
              fill="#FFFFFF"
              fontFamily="Tahoma"
              align="right"
              width={75}
            />
            <Text
              x={112}
              y={180}
              text={(
                Math.abs(DET_max_Value / 2) +
                DET_min_Value / 2
              ).toString()}
              fontSize={10.5}
              fill="#FFFFFF"
              fontFamily="Tahoma"
              align="right"
              width={75}
            />
            <Text
              x={110}
              y={272}
              text={DET_min_Value.toString()}
              fontSize={10.5}
              fill="#FFFFFF"
              fontFamily="Tahoma"
              align="right"
              width={75}
            />
          </Group>
        </Portal>
      )}
    </>
  );
};
export default DetectorControl;
