export interface IEquipment {
  kks: string;
  sys: string;
  samples: ISample[];
}

export interface ISample {
  sample: string;
  value: string;
}
