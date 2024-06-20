import { ISample } from "../IEquipment";

export interface IElectricControlBRK6 {
  id: number;
  type: "ElectricControlBRK6";
  x: number;
  y: number;
  height: number;
  width: number;
  kks: string;
  samples?: ISample[];
  red: number;
  green: number;
  blue: number;
  rotate: string;
  description: string;
}
