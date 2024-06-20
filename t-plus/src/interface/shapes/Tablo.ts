import { ISample } from "../IEquipment";

export interface ITablo {
    id: number;
    type: "Tablo";
    x: number;
    y: number;
    height: number;
    width: number;
    firstStatus: string;
    secondStatus: string;
    thirdStatus: string;
    textAlignment: string;
    kks:string;
    sys : string;
    red: number;
    green: number;
    blue: number;
    red2: number;
    green2: number;
    blue2: number;
    red3: number;
    green3: number;
    blue3: number;
    fontSize?: number;
    fontName?: string;
    fontWeight?: string;
    opacity?: number;
    samples?: ISample[];
  }
  