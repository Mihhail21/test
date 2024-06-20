import { ISample } from "../IEquipment";

export interface IElectricGateValve {
  id: string;
  type: string;
  x: number;
  y: number;
  fontSize?: number;
  kks: string;
  rotate?: string;
  sys: string;
  prefHeight: number;
  prefWidth: number;
  samples: ISample[];
  description:string;
}
