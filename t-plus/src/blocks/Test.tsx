

import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle, Text, Shape, Rect, Label, Tag, Group } from "react-konva";
import { animateScroll as scroll } from "react-scroll";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";



const minValue = 0;
const maxValue = 600;
const stepsY = 5;
const initialStepsX = 12; // 12 * 5 = 60 точек

type DataPoint = {
  x: number;
  value: number;
  date: string;
};

type GraphProps = {
  dataValue: number;
  onClose: () => void;
};

const Test = () => {




  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const width = 1000;
  const height = 500;
  const paddingLeft = 70;
  const paddingRight = 50;
  const paddingBottom = 30;
  const paddingTop = 25;
  const gridOffsetLeft = 30;
  const gridOffsetBottom = 10;

  const containerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const currentDate = new Date();
  //   const seconds = currentDate.getSeconds();
  //   const minutes = currentDate.getMinutes();

  //   setDataPoints((prevDataPoints) => [
  //     ...prevDataPoints,
  //     {
  //       x: prevDataPoints.length,
  //       value: dataValue,
  //       date: `${minutes}:${seconds}`,
  //     },
  //   ]);
  // }, [dataValue]);

  useEffect(() => {
    if (isAutoScroll && containerRef.current) {
      scroll.scrollTo(containerRef.current.scrollWidth, {
        duration: 500,
        smooth: "easeInOutQuad",
        container: containerRef.current,
      });
    }
  }, [dataPoints, isAutoScroll]);

  const handleScroll = () => {
    if (containerRef.current) {
      const isAtEnd =
        containerRef.current.scrollLeft + containerRef.current.clientWidth >= containerRef.current.scrollWidth;
      setIsAutoScroll(isAtEnd);
    }
  };

  const totalStepsX = Math.max(initialStepsX, Math.ceil(dataPoints.length / 5));
  const stepX = (width - paddingLeft - paddingRight) / (initialStepsX - 1);
  const stepY = (height - paddingBottom - paddingTop) / stepsY;

  const transformY = (value: number) =>
    height - paddingBottom - ((value - minValue) / (maxValue - minValue)) * (height - paddingBottom - paddingTop);
  const transformX = (index: number) => paddingLeft + (index / 5) * stepX;

  const linePoints = dataPoints.map((point, index) => [transformX(index), transformY(point.value)]).flat();
  const areaPoints = [
    ...linePoints,
    transformX(dataPoints.length - 1),
    height - paddingBottom,
    transformX(0),
    height - paddingBottom,
  ];

  const drawGrid = () => {
    const gridLines = [];

    for (let i = 0; i <= totalStepsX; i++) {
      gridLines.push(
        <Line
          key={`v-${i}`}
          points={[
            paddingLeft + i * stepX,
            paddingTop - gridOffsetBottom,
            paddingLeft + i * stepX,
            height - paddingBottom + gridOffsetBottom,
          ]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }

    for (let i = 0; i <= stepsY; i++) {
      gridLines.push(
        <Line
          key={`h-${i}`}
          points={[
            paddingLeft - gridOffsetLeft,
            height - paddingBottom - i * stepY,
            paddingLeft + totalStepsX * stepX,
            height - paddingBottom - i * stepY,
          ]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }

    return gridLines;
  };
  return (
    <Group
      draggable
 
    >
      <Rect
        height={500}
        width={1200}
        stroke="white"
        fill="grey"
        strokeWidth={2}
       
      />

<Stage
        width={
          dataPoints.length > initialStepsX * 5
            ? totalStepsX * stepX + paddingLeft + paddingRight
            : width + paddingRight
        }
        height={height}
      >
        <Layer>
          <Rect
            width={
              dataPoints.length > initialStepsX * 5
                ? totalStepsX * stepX + paddingLeft + paddingRight
                : width + paddingRight
            }
            height={height}
            fill="rgb(101, 116, 128)"
          />
          {drawGrid()}
          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath();
              context.moveTo(transformX(0), transformY(dataPoints[0]?.value ?? 0));
              areaPoints.forEach((point, index) => {
                if (index % 2 === 0) {
                  context.lineTo(point, areaPoints[index + 1]);
                }
              });
              context.closePath();
              context.fillStrokeShape(shape);
            }}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: 0, y: height - paddingBottom }}
            fillLinearGradientColorStops={[0, "lightblue", 1, "rgba(173, 216, 230, 0)"]}
          />
          <Line points={linePoints} stroke="#00f" strokeWidth={2} lineCap="round" lineJoin="round" />
          <Line points={linePoints} stroke="#00f" strokeWidth={8} opacity={0.1} lineCap="round" lineJoin="round" />
          {dataPoints.map((point, index) => (
            <Circle
              key={index}
              x={transformX(index)}
              y={transformY(point.value)}
              radius={5}
              fill="#6f0"
              stroke="#6f0"
              strokeWidth={2}
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
          {dataPoints.map((point, index) =>
            index === 0 || index % 5 === 0 || hoveredPoint === index ? (
              <Label key={index} x={transformX(index) - 10} y={transformY(point.value) - 25}>
                <Tag fill="white" stroke="black" strokeWidth={1} cornerRadius={3} />
                <Text text={`${point.value}`} fontSize={13} fill="#333" padding={2} />
              </Label>
            ) : null
          )}
          {dataPoints.map((point, index) =>
            index % 5 === 0 || index === 0 ? (
              <Text
                key={index}
                x={transformX(index) - 15}
                y={height - paddingBottom + 10}
                text={`${point.date}`}
                fontSize={12}
                fill="#fff"
              />
            ) : null
          )}
        </Layer>
      </Stage>
     
    </Group>
  );
};

export default Test;
