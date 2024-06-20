import LineMain from "@/blocks/LineMain";
import LineArrow from "@/blocks/LineArrow";
import TextMain from "@/blocks/TextMain";
import Point from "@/blocks/Point";
import HandFittings from "@/blocks/HandFittings";
import Regulator from "@/blocks/Regulator";
import ElectricGateValve from "@/blocks/ElectricGateValve";
import SafetyShutOffValve from "@/blocks/SafetyShutOffValve";
import BackSafetyValve from "@/blocks/BackSafetyValve";
import SafetyValve from "@/blocks/SafetyValve";
import AirFilters from "@/blocks/AirFilters";
import PumpControl from "@/blocks/PumpControl";
import PumpControlPMK from "@/blocks/PumpControlPMK";
import DetectorControl from "@/blocks/DetectorControl";
import Rectangle from "@/blocks/Rectangle";
import ArcShape from "@/blocks/ArcShape";
import ReverseValve from "@/blocks/ReverseValve";
import PolygonShape from "@/blocks/PolygonShape";
import EllipseShape from "@/blocks/EllipseShape";
import Button from "@/blocks/Button";
import ButtonReturn from "@/blocks/ButtonReturn";
import ButtonText from "@/blocks/ButtonText";
import ButtonXMD from "@/blocks/ButtonXMD";
import ProgressBar from "@/blocks/ProgressBar";
import Tablo from "@/blocks/Tablo";
import Lamp from "@/blocks/Lamp";
import InputControl from "@/blocks/InputControl";
import ElectricControlBRKD from "@/blocks/ElectricControlBRKD";
import ElectricControlBRKG from "@/blocks/ElectricControlBRKG";
import TwvlvValve from "@/blocks/TwvlvValve";
import TwcntValve from "@/blocks/TwcntValve";
import TwhcntValve from "@/blocks/TwhcntValve";
import ElectricControlBreaker from "@/blocks/ElectricControlBreaker";
import ElectricControlBRK6 from "@/blocks/ElectricControlBRK6";
import { TransformedData } from "@/interface";

export const componentMap: { [key: string]: React.ComponentType<any> } = {
  LineMain,
  LineArrow,
  TextMain,
  Point,
  HandFittings,
  Regulator,
  ElectricGateValve,
  SafetyShutOffValve,
  BackSafetyValve,
  SafetyValve,
  PumpControl,
  PumpControlPMK,
  AirFilters,
  DetectorControl,
  Rectangle,
  ArcShape,
  ReverseValve,
  PolygonShape,
  EllipseShape,
  Button,
  ButtonReturn,
  ButtonText,
  Tablo,
  ProgressBar,
  Lamp,
  ButtonXMD,
  InputControl,
  ElectricControlBRKD,
  ElectricControlBRKG,
  TwvlvValve,
  TwcntValve,
  TwhcntValve,
  ElectricControlBreaker,
  ElectricControlBRK6,
};

export const makeBlock = (block: TransformedData) => {
  const Component = componentMap[block.type];
  if (!Component) {
    return null;
  }
  return <Component key={block.id} block={block} />;
};
