import { TransformedData } from "@/interface";

export interface DataItem {
  type: string;
  kks: string;
  sys: string; 
}

type TypeToSamplesMap = Record<string, string[]>;

export const convertToRequest = (data: DataItem[]) => {
  const typeToSamplesMap: TypeToSamplesMap = {
    DetectorControl: ["DET_Status", "DET_max", "DET_min"],
    PumpControl: ["PMP_MF", "PMP_PWR", "PMP_Status", "PMP_Repair", "PMP_Banon", "PMP_Banoff", "PMP_AVR", "PMP_Work"],
    PumpControlPMK: [ "PMK_PWR", "PMK_Status", "PMK_Repair", "PMK_Banon", "PMK_Banoff", "PMK_AVR", "PMK_Work", "PMK_Detector_web", "PMK_Chrplmp", "PMK_CMD_Setpoint", "PMK_CMD_SetpointWeb", "PMK_Setpoint_OutputWeb", "PMK_Manual_OutputWeb", "PMK_CMD_AutoManualWeb", "PMK_Auto_OutputWeb", "PMK_Detector_max", "PMK_Detector_min", ],
    ElectricGateValve: ["MOV_Status", "MOV_MF", "MOV_PWR", "MOV_Repair", "MOV_Time", "MOV_Banopn", "MOV_Bancls"],
    SafetyValve: ["RLF_Status"],
    Regulator: ["CNT_Status", "CNT_MF", "CNT_Repair", "CNT_PWR", "CNT_Auto_Output", "CNT_CMD_Setpoint", "CNT_CMD_Setpoint1", "CNT_Detector_max", "CNT_Detector_min", "CNT_Banopn", "CNT_Bancls", "CNT_Detector", "CNT_Manual_Output", ],
    SafetyShutOffValve: ["SOL_Status", "SOL_MF", "SOL_PWR", "SOL_Repair", "SOL_Banopn", "SOL_Bancls"],
    HandFittings: ["VLV_Status", "VLV_MF", "VLV_Repair", "VLV_Time", "VLV_Position" ],
    ReverseValve: ["CHV_Status"],
    ProgressBar: ["LEVEL_Status"],
    Tablo: ["TABLO_Status", "TABLO_MF"],
    Lamp: ["LAMP_Status", "LAMP_MF"],
    Button: ["BUTTON_Status"],
    ButtonReturn: ["RETURN_BUTTON_Status"],
    ButtonText: ["TEXT_BUTTON_Status"],
    ButtonXMD: ["XMD_Status"],
    InputControl: ["TXT_Status"],
    ElectricControlBRKD: ["BRKD_Status"],
    ElectricControlBRKG: ["BRKG_Status"],
    TwvlvValve: ["TWVLV_Status_Left", "TWVLV_Status_Top", "TWVLV_Status_Right"],
    TwcntValve: ["TWCNT_Status_Left", "TWCNT_Status_Top", "TWCNT_Status_Right", "TWСNT_Status","TWCNT_Auto_Output", "TWCNT_Manual_Output", "TWCNT_CMD_Setpoint", "TWCNT_CMD_Setpoint1", "TWCNT_Detector_max", "TWCNT_Detector_min", "TWCNT_Detector", "TWCNT_Banopn", "TWCNT_Bancls", "CNT_PWR" ],
    TwhcntValve: ["TWHCNT_Status_Left", "TWHCNT_Status_Top", "TWHCNT_Status_Right", "TWHCNT_Status", "TWHCNT_Time", "TWHCNT_Position", "TWHCNT_Position"],
    ElectricControlBreaker: ["BRK_Status"],
    ElectricControlBRK6: ["BRK6_Status", "BRK6_R"],
    BackSafetyValve: ["SOL_Status", "SOL_MF", "SOL_PWR", "SOL_Repair", "SOL_Banopn", "SOL_Bancls"],
  };

  const result = {
    equipments: data.map((item) => {
      const samples = typeToSamplesMap[item.type] || [];
      if (
        [
          "ButtonText",
          "ButtonReturn",
          "ElectricControlBRK6",
          "ElectricControlBreaker",
          "TwhcntValve",
          "TwcntValve",
          "TwvlvValve",
          "ElectricControlBRKG",
          "ElectricControlBRKD",
          "InputControl",
          "ButtonXMD",
          "Lamp",
          "Button",
          "Tablo",
          "PumpControl",
          "PumpControlPMK",
          "ProgressBar",
          "DetectorControl",
          "ReverseValve",
          "HandFittings",
          "ElectricGateValve",
          "SafetyValve",
          "Regulator",
          "SafetyShutOffValve",
          "BackSafetyValve",
        ].includes(item.type)
      ) {
        return {
          kks: item.kks,
          sys: item.sys,
          samples: samples,
        };
      } else {
        return {
          samples: samples,
        };
      }
    }),
  };
  return result;
};
