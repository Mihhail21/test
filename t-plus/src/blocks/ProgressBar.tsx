import { Group, Rect } from "react-konva";
import { IProgressBar } from "@/interface";

interface ProgressBarProps {
  block: IProgressBar;
}
const SAMPLE_LEVEL_Status = "LEVEL_Status";

const ProgressBar = ({ block }: ProgressBarProps) => {
  const statusSampleLEVEL_Status = block.samples?.find((s) =>
    s.sample.includes(SAMPLE_LEVEL_Status)
  );

  const statusSampleCNT_StatusValue = statusSampleLEVEL_Status
    ? Math.min(parseFloat(statusSampleLEVEL_Status.value), block.maxValue)
    : 0;

  let rotation: number;
  switch (block.rotate) {
    case "VERTICAL_REVERSE":
      rotation = 90;
      break;
    case "VERTICAL":
      rotation = 270;
      break;
    case "HORIZONTAL":
      rotation = 0;
      break;
    case "HORIZONTAL_REVERSE":
      rotation = 180;
      break;
    default:
      rotation = 0;
  }

  let progressBarWidth =
    ((statusSampleCNT_StatusValue * 100) /
      (block.maxValue === 0 ? Math.abs(block.minValue) 
      : block.maxValue)) * block.width * 0.01;

  let startX: number;
  if (block.rotate == "VERTICAL_REVERSE" && Number.isNaN(block.minValue)) {
    startX = block.width - progressBarWidth;
  } else if (block.rotate == "VERTICAL_REVERSE" && block.maxValue === 0) {
    startX = block.width;
    progressBarWidth = -block.width - progressBarWidth;
  } else if (block.rotate == "VERTICAL_REVERSE") {
    startX = block.width;
    progressBarWidth = -progressBarWidth / 2 - block.width / 2;
  } else {
    startX = 0;
  }

  return (
    <Group
      x={block.x + block.width / 2}
      y={block.y + block.height / 2}
      opacity={block.opacity}
      rotation={rotation}
      offsetX={block.width / 2}
      offsetY={block.height / 2}
    >
      <Rect
        height={block.height}
        width={block.width}
        stroke="black"
        fill="grey"
        strokeWidth={1}
      />
      {block.kks !== "" && (
        <Rect
          x={startX}
          y={0}
          height={block.height}
          width={progressBarWidth}
          stroke="black"
          fill="blue"
          strokeWidth={1}
        />
      )}
    </Group>
  );
};

export default ProgressBar;
