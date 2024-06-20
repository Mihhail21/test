import { IArcShape } from "@/interface";
import { Shape, Group } from "react-konva";

interface IArcShapeProps {
  block: IArcShape;
}


const ArcShape = ({ block }: IArcShapeProps) => {
  const extraRadius = -block.strokeWidth + 2;
  let radius: number;
  if (block.strokeType == "INSIDE" && block.startAngle !== 0 && block.startAngle !== 180) {
    radius = block.radiusY + extraRadius;
  } else if (block.startAngle == 0) {
    radius = block.radiusX + extraRadius;
  } else if (block.startAngle == 180) {
    radius = block.radiusX + extraRadius;
  } else if (block.startAngle == 90) {
    radius = block.radiusY;
  } else if (block.startAngle == 270) {
    radius = block.radiusY;
  } else {
    radius = block.radiusX;
  }
  const startAngle = block.startAngle || 0;
  const endAngle = startAngle + block.length;

  const drawArc = (context: CanvasRenderingContext2D) => {
    context.beginPath();
    if (!block.startAngle || block.startAngle === 180) {
      context.arc(0, 0, radius, (endAngle * Math.PI) / 180, (startAngle * Math.PI) / 180);
    } else {
      context.arc(0, 0, radius, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180);
    }

    context.strokeStyle = block.stroke;
    context.lineWidth = block.strokeWidth;
    context.fillStyle = block.fill;
    context.fill();
    context.stroke();
  };

  return (
    <Group x={block.x} y={block.y} rotation={0}>
      <Shape sceneFunc={(context) => drawArc(context._context)} />
    </Group>
  );
};

export default ArcShape;
