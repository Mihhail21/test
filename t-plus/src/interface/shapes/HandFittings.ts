import { ISample } from "../IEquipment";

export interface IHandFittings {
  id: string;
  type: "HandFittings";
  x: number;
  y: number;
  fontSize?: number;
  kks: string;
  sys: string;
  rotate: string;
  prefHeight: number;
  prefWidth: number;
  samples: ISample[];
  description:string;
}
