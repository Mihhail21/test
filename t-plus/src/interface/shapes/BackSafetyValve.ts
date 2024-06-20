import { ISample } from "../IEquipment";

export interface IBackSafetyValve {
  id: string;
  type: string;
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
