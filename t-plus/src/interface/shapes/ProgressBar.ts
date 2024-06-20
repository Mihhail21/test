import { ISample } from "../IEquipment";

export interface IProgressBar {
  id: number;
  type: string;
  x: number;
  y: number;
  rotate: string;
  height: number;
  width: number;
  kks: string;
  opacity: number;
  maxValue: number;
  minValue: number;
  samples: ISample[];
}
