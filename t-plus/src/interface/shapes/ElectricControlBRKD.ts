import { ISample } from "../IEquipment";

export interface IElectricControlBRKD {
  id: number;
  type: "ElectricControlBRKD";
  x: number;
  y: number;
  kks: string;
  height: number;
  width: number;
  samples?: ISample[];
  red: number;
  green: number;
  blue: number;
  rotate: string;
  description: string;
}
