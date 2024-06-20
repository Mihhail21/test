import { ISample } from "../IEquipment";

export interface ILamp {
    id: number;
    type: "Lamp";
    x: number;
    y: number;
    height: number;
    width: number;
    kks:string;
    red: number;
    green: number;
    blue: number;
    samples?: ISample[];
  }
  