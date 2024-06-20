import { ISample } from "../IEquipment";

export interface IRegulator {
  id: string;
  type: string;
  x: number;
  y: number;
  kks: string;
  sys: string;
  rotate: string;
  prefHeight: number;
  prefWidth: number;
  samples: ISample[];
  description: string;
}
