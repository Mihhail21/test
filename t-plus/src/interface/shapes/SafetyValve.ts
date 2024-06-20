import { ISample } from "../IEquipment";

export interface ISafetyValve {
  id: string;
  type: "SafetyValve";
  x: number;
  y: number;
  fontSize?: number;
  kks: string;
  sys: string;
  samples: ISample[];
  rotate: string;
  prefHeight: number;
  prefWidth: number;
  scaleY: number;
  description: string;
}
