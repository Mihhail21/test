import {
  IArcShape,
  IDetectorControl,
  IElectricGateValve,
  ILineArrow,
  ILineMain,
  ITextMain,
  IPoint,
  IPumpControl,
  IPumpControlPMK,
  IRectangle,
  IRegulator,
  IReverseValve,
  IPolygonShape,
  IEllipseShape,
  IButton,
  IButtonXMD,
  IBackSafetyValve,
  IAirFilters,
  IProgressBar,
  ITablo,
  ILamp,
  IInputControl,
  IElectricControlBRKD,
  IElectricControlBRKG,
  IElectricControlBreaker,
  IElectricControlBRK6,
  IButtonReturn,
  IButtonText,
} from "@/interface";

export type TransformedData =
  | IPumpControl
  | IPumpControlPMK
  | ITextMain
  | IPoint
  | ILineMain
  | ILineArrow
  | IDetectorControl
  | IRectangle
  | IArcShape
  | IElectricGateValve
  | IRegulator
  | IPolygonShape
  | IEllipseShape
  | IReverseValve
  | IAirFilters
  | IBackSafetyValve
  | IButton
  | IButtonXMD
  | ITablo
  | ILamp
  | IInputControl
  | IProgressBar
  | IElectricControlBRKD
  | IElectricControlBRKG
  | IElectricControlBreaker
  | IElectricControlBRK6
  | IButtonReturn
  | IButtonText;
