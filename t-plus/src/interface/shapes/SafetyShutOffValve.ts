import { ISample } from "../IEquipment";

export interface ISafetyShutOffValve {
  id: string;
  type: "SafetyShutOffValve";
  x: number;
  y: number;
  fontSize?: number;
  kks: string;
  sys: string;
  samples: ISample[];
  rotate: string;
  prefHeight: number;
  prefWidth: number;
  description: string;
}
