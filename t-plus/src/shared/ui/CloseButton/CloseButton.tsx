import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import "konva/lib/shapes/Image";
import closeIcon from "../../assets/icons/buttonClose.svg";

interface CloseButtonProps {
  onClick: () => void;
  x: number;
  y: number;
}

const CloseButton: React.FC<CloseButtonProps> = ({ x, y, onClick }) => {
  const [image] = useImage(closeIcon);
  return <Image x={x} y={y} image={image} width={25} height={25} onClick={onClick} />;
};

export default CloseButton;
