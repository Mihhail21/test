import { ISample } from "../IEquipment";

export interface IButtonReturn {
  id: number;
  type: "ButtonReturn";
  x: number;
  y: number;
  height: number;
  width: number;
  buttonOnText: string;
  buttonOffText: string;
  samples?: ISample[];
  kks: string;
  red: number;
  green: number;
  blue: number;
  red2: number;
  green2: number;
  blue2: number;
  opacity: number;
  borderWidth: number;
  borderColor: string;
  size: number;
  fontStyle: string;
  fontName: string;
}
