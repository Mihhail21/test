import { ILamp } from "@/interface";
import { Group, Rect } from "react-konva";

interface ITabloProps {
  block: ILamp;
}

const SAMPLE_STATUS_NAME = "LAMP_Status";

const Lamp = ({ block }: ITabloProps) => {
  
  const secondfillColor = `rgb(${block.red * 255}, ${block.green * 255}, ${block.blue * 255})`;

  const statusSample = block.samples?.find((s) =>
    s.sample.includes(SAMPLE_STATUS_NAME)
  );

  let statusValue = statusSample ? parseFloat(statusSample.value) : 0;

  let buttonColor: string;
  if (statusValue === 0) {
    buttonColor = "grey";
  } else {
    buttonColor = secondfillColor;
  }

  return (
    <Group x={block.x} y={block.y}>
      <Rect
        width={block.width}
        height={block.height}
        fill={buttonColor}
        cornerRadius={10}
        stroke="black"
        strokeWidth={1}
      />
    </Group>
  );
};

export default Lamp;
