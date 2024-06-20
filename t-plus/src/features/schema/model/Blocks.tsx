import { FC } from "react";
import { makeBlock } from "./blockFactory";
import { TransformedData } from "@/interface/TransformedData";

interface IBlocksProps {
  blocks: TransformedData[];
}

const Blocks: FC<IBlocksProps> = ({ blocks }) => {
  return <>{blocks.map((block) => makeBlock(block))}</>;
};

export default Blocks;
