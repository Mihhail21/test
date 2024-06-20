import { ISample } from "../IEquipment";

export interface IDetectorControl {
  id: number;
  type: "DetectorControl";
  x: number;
  y: number;
  kks: string;
  param: string;
  unit: string | null;
  tooltipText: string;
  sys: string;
  value?: string;
  samples?: ISample[];
  decimals: number;
  maxValue: number;
  minValue: number;
  height:number;
}
