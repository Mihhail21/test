import { ISample } from "../IEquipment";

export interface IButtonXMD {
  id: number;
  type: "ButtonXMD";
  x: number;
  y: number;
  height: number;
  width: number;
  kks: string;
  buttonOnText: string;
  buttonOffText: string;
  samples?: ISample[];
  red: number;
  green: number;
  blue: number;
  red2: number;
  green2: number;
  blue2: number;
}
