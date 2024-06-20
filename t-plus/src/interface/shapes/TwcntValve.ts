import { ISample } from "../IEquipment";

export interface ITwcntValve {
  id: string;
  type: string;
  x: number;
  y: number;
  kks: string;
  rotate?: string;
  sys: string;
  prefHeight: number;
  prefWidth: number;
  samples: ISample[];
  scaleY?: number;
  description: string;
}
