import { Group, Line, Rect } from "react-konva";
import { IAirFilters } from "@/interface";

interface AirFiltersProps {
  block: IAirFilters;
}

const AirFilters = ({ block }: AirFiltersProps) => {
  return (
    <Group
      draggable
      x={block.x + block.height / 2}
      y={block.y - block.height / 20}
      opacity={block.opacity}
    >
      <Rect
        height={block.height - block.height / 4}
        width={block.width - block.width / 4}
        stroke="white"
        fill="grey"
        strokeWidth={2}
        rotation={45}
      />
      <Line
        points={block.rotate === 'HORIZONTAL' ? [-block.height/2, block.height/2, block.height/2, block.height/2] : [0, 5, 0, block.height]}
        stroke="white"
        strokeWidth={1.5}
        dash={block.rotate === 'HORIZONTAL' ? [10, 5] : [15, 15]}

      />
    </Group>
  );
};

export default AirFilters;
