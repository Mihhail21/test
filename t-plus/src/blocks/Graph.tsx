import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle, Text, Shape, Rect, Label, Tag } from "react-konva";
import { customToFixed } from "@/shared/utils/customToFixed";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";

const width = 1000;
const height = 500;
const paddingLeft = 70;
const paddingRight = 50;
const paddingBottom = 30;
const paddingTop = 25;
const gridOffsetLeft = 30;
const gridOffsetBottom = 10;
const stepsY = 5;
const initialStepsX = 12;

interface DataPoint {
  x: number;
  value1: number;
  value2: number;
  date: string;
}

interface GraphProps {
  dataValue1: number;
  dataValue2: number;
  minValue: number;
  maxValue: number;
  onClose: () => void;
}

const Graph: React.FC<GraphProps> = ({ dataValue1, dataValue2, maxValue, minValue, onClose }) => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);
  const [hoveredPoint1, setHoveredPoint1] = useState<number | null>(null);
  const [hoveredPoint2, setHoveredPoint2] = useState<number | null>(null);


  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentDate = new Date();
    const seconds = currentDate.getSeconds();
    const minutes = currentDate.getMinutes();

    setDataPoints((prevDataPoints) => [
      ...prevDataPoints,
      {
        x: prevDataPoints.length,
        value1: Number(customToFixed(dataValue1, 0)),
        value2: Number(customToFixed(dataValue2, 0)),
        date: `${minutes}:${seconds}`,
      },
    ]);
  }, [dataValue1, dataValue2]);

  useEffect(() => {
    if (isAutoScroll && containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
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

  const linePoints1 = dataPoints.map((point, index) => [transformX(index), transformY(point.value1)]).flat();
  const linePoints2 = dataPoints.map((point, index) => [transformX(index), transformY(point.value2)]).flat();

  const areaPoints1 = [
    ...linePoints1,
    transformX(dataPoints.length - 1),
    height - paddingBottom,
    transformX(0),
    height - paddingBottom,
  ];
  const areaPoints2 = [
    ...linePoints2,
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

  const yLabels = Array.from({ length: stepsY + 1 }, (_, i) => ({
    y: i,
    label: Number(`${minValue + ((maxValue - minValue) / stepsY) * i}`),
  }));

  return (
    <div style={{ position: "relative", width: width + paddingRight }}>
      <div
        style={{
          position: "absolute",
          top: -50,
          left: 0,
          height: 50,
          width: width + paddingRight,
        }}
      >
        <Stage width={width + paddingRight} height={51}>
          <Layer>
            <Rect
              width={width + paddingRight}
              height={50}
              fill="rgb(245, 245, 245)"
              stroke="rgb(185, 185, 185)"
              strokeWidth={1}
              cornerRadius={[10, 10, 0, 0]}
            />

            <CloseButton x={width + paddingRight - 30} y={12} onClick={onClose} />
          </Layer>
        </Stage>
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          width: "100%",
          overflowX: "scroll",
          height: height + 13,
          border: "1px solid #ddd",
          scrollbarWidth: "thin",
        }}
      >
        <div
          style={{
            width:
              dataPoints.length > initialStepsX * 5
                ? totalStepsX * stepX + paddingLeft + paddingRight
                : width + paddingRight,
            transition: "width 0.5s ease-out",
          }}
        >
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
                  context.moveTo(transformX(0), transformY(dataPoints[0]?.value1 ?? 0));
                  areaPoints1.forEach((point, index) => {
                    if (index % 2 === 0) {
                      context.lineTo(point, areaPoints1[index + 1]);
                    }
                  });
                  context.closePath();
                  context.fillStrokeShape(shape);
                }}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: 0, y: height - paddingBottom }}
                fillLinearGradientColorStops={[0, "lightblue", 1, "rgba(173, 216, 230, 0)"]}
              />
              <Shape
                sceneFunc={(context, shape) => {
                  context.beginPath();
                  context.moveTo(transformX(0), transformY(dataPoints[0]?.value2 ?? 0));
                  areaPoints2.forEach((point, index) => {
                    if (index % 2 === 0) {
                      context.lineTo(point, areaPoints2[index + 1]);
                    }
                  });
                  context.closePath();
                  context.fillStrokeShape(shape);
                }}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: 0, y: height - paddingBottom }}
                fillLinearGradientColorStops={[0, "lightcoral", 1, "rgba(255, 182, 193, 0)"]}
              />
              <Line points={linePoints1} stroke="#00f" strokeWidth={2} lineCap="round" lineJoin="round" />
              <Line points={linePoints2} stroke="#f00" strokeWidth={2} lineCap="round" lineJoin="round" />
              <Line points={linePoints1} stroke="#00f" strokeWidth={8} opacity={0.1} lineCap="round" lineJoin="round" />
              <Line points={linePoints2} stroke="#f00" strokeWidth={8} opacity={0.1} lineCap="round" lineJoin="round" />
              {dataPoints.map((point, index) => (
                <Circle
                  key={index}
                  x={transformX(index)}
                  y={transformY(point.value1)}
                  radius={5}
                  fill="#6f0"
                  stroke="#6f0"
                  strokeWidth={2}
                  onMouseEnter={() => setHoveredPoint1(index)}
                  onMouseLeave={() => setHoveredPoint1(null)}
                />
              ))}
              {dataPoints.map((point, index) => (
                <Circle
                  key={index}
                  x={transformX(index)}
                  y={transformY(point.value2)}
                  radius={5}
                  fill="#f00"
                  stroke="#f00"
                  strokeWidth={2}
                  onMouseEnter={() => setHoveredPoint2(index)}
                  onMouseLeave={() => setHoveredPoint2(null)}
                />
              ))}
              {dataPoints.map((point, index) =>
                index === 0 || index % 5 === 0 || hoveredPoint1 === index ? (
                  <Label key={index} x={transformX(index) - 10} y={transformY(point.value1) - 25}>
                    <Tag fill="white" stroke="black" strokeWidth={1} cornerRadius={3} />
                    <Text text={`blue: ${point.value1}`} fontSize={13} fill="#333" padding={2} />
                  </Label>
                ) : null
              )}
              {dataPoints.map((point, index) =>
                index === 0 || index % 5 === 0 || hoveredPoint2 === index ? (
                  <Label key={index} x={transformX(index) - 10} y={transformY(point.value2) - 25}>
                    <Tag fill="white" stroke="black" strokeWidth={1} cornerRadius={3} />
                    <Text text={`red: ${point.value2}`} fontSize={13} fill="#333" padding={2} />
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
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          height: height,
          width: 50,
          backgroundColor: "rgb(101, 116, 128)",
          border: "1px solid #ddd",
        }}
      >
        <Stage width={paddingLeft} height={height}>
          <Layer>
            {yLabels.map((label, index) => (
              <React.Fragment key={index}>
                <Text
                  x={0}
                  y={height - paddingBottom - index * stepY - 10}
                  text={customToFixed(label.label, 0)}
                  fontSize={12}
                  fill="#fff"
                  align="right"
                  width={45}
                />
                <Line
                  points={[10, height - paddingBottom - index * stepY, 50, height - paddingBottom - index * stepY]}
                  stroke="#fff"
                  strokeWidth={1}
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: -25,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          border: "1px solid #ddd",
          width: "1050px",
        }}
      >
        <span>Формат времени: [мин:сек]</span>
      </div>
    </div>
  );
};

export default Graph;
