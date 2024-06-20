import { ISample } from "../IEquipment";

export interface IButtonText {
  id: number;
  type: "ButtonText";
  x: number;
  y: number;
  height: number;
  width: number;
  buttonOnText: string;
  buttonOffText: string;
  textAlignment: string;
  samples?: ISample[];
  kks: string;
  opacityMain: number;
  size: number;
  fontName: string;
  fontStyle: string;
  red: number;
  green: number;
  blue: number;
  opacity: number;
  red2: number;
  green2: number;
  blue2: number;
  opacity2: number;
  borderWidth: number;
  borderColor: string;
  interactive: string;
}
