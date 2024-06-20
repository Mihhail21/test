import { ISample } from "../IEquipment";

export interface IPumpControl {
  id: number;
  type: "PumpControl";
  x: number;
  y: number;
  kks: string;
  prefHeight: number;
  prefWidth: number;
  rotate: string;
  samples?: ISample[];
  sys: string;
  description: string;
  withAVR: string;
}
