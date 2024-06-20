import { ISample } from "../IEquipment";

export interface IInputControl {
  id: number;
  type: "InputControl";
  x: number;
  y: number;
  height: number;
  width: number;
  kks: string;
  samples?: ISample[];
  maxValue: number;
  decimals: number;
  fontSize: number;
  fontName: string;
  interactive:string;
}
