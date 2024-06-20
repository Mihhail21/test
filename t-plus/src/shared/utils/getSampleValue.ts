import { ISample } from "@/interface/IEquipment";

export const getSampleValue = (samples: ISample[] = [], sampleName: string): number => {
  const sample = samples.find((s) => s.sample === sampleName);
  return sample ? Number(sample.value) : 0;
};
