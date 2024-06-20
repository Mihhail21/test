import { ISample } from "../IEquipment";

export interface IPumpControlPMK {
  id: number;
  type: "PumpControlPMK";
  x: number;
  y: number;
  fontSize?: number;
  kks: string;
  prefHeight: number;
  prefWidth: number;
  rotate: string;
  samples?: ISample[];
  sys?: string;
  description: string;
}
