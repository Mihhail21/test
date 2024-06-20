import { ISample } from "../IEquipment";

export interface IElectricControlBRKG {
  id: number;
  type: "ElectricControlBRKG";
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
