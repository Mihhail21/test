import { useEffect, useState } from "react";
import styles from "./GeneralStationParameters.module.scss";
import Thermometer from "../../../../shared/assets/icons/thermometer.svg";
import { useAppSelector } from "@/shared/model/useReduxHooks";
import SkeletonLoader from "@/shared/ui/SkeletonLoader/SkeletonLoader";
import { useParams } from "react-router-dom";
import { IBranch, IStation } from "@/interface/stations";
import { EquipmentData } from "../../DashBoardMain";

interface IStationParameterView {
  kks: string;
  sample: string;
  value: string | null;
}
interface IStationParametersMap {
  [key: string]: IStationParameterView;
}

const GeneralStationParameters: React.FC = () => {
  const { branchCode, stationCode } = useParams();

  const branches = useAppSelector((state) => state.branches.items);
  const dashBoard = useAppSelector((state) => state.dashBoard.dashBoard);
  const isDashboardInitialized = useAppSelector((state) => state.dashBoard.isInitialized);

  const [parametersMap, setParametersMap] = useState<IStationParametersMap | null>(null);

  const EQUIPMENT_SAMPLE = "DET_Status";

  const findEquipmentValue = (kks: string, sample: string, equipmentsData: EquipmentData[]) => {
    return equipmentsData.find((item) => item.kks === kks)?.samples.find((s) => s.sample === sample)?.value;
  };

  const findStation = (branchCode: string, stationCode: string) => {
    const foundBranch = branches.find((branch: IBranch) => branch.code === branchCode) || null;
    return foundBranch ? foundBranch.stations.find((station: IStation) => station.code === stationCode) || null : null;
  };

  useEffect(() => {
    const station = findStation(branchCode, stationCode);
    if (station) {
      const map: IStationParametersMap = {};
      Object.keys(station.dashboard.commonParameters).forEach((key: string) => {
        const parameter = station.dashboard.commonParameters[key];
        const value = isDashboardInitialized
          ? findEquipmentValue(parameter.kks, EQUIPMENT_SAMPLE, dashBoard) || null
          : null;
        map[key] = {
          kks: parameter.kks,
          sample: EQUIPMENT_SAMPLE,
          value,
        } as IStationParameterView;
      });
      setParametersMap(map);
    }
  }, [isDashboardInitialized]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Общестанционные параметры </h1>
      <div className={styles.line}></div>
      <div className={styles.firstLine}>
        <div className={styles.firstBlock}>
          <span>Цена РСВ, Р/МВт*ч</span>
          <div className={styles.value}>1666,4</div>
        </div>
        <div className={styles.secondBlock}>
          <span>Суммарная электрическая нагрузка, МВт</span>
          <div className={styles.value}>
            {parametersMap?.TotalElectricalLoad.value ? (
              <div className={styles.value}>
                {parametersMap.TotalElectricalLoad.kks !== null &&
                  parseFloat(parametersMap.TotalElectricalLoad.value).toFixed(2)}
                {parametersMap.TotalElectricalLoad.kks === null && <>XXXX</>}
              </div>
            ) : (
              <SkeletonLoader width="50px" height="20px" />
            )}
          </div>
        </div>
      </div>
      <div className={styles.secondLine}>
        <div className={styles.thirdBlock}>
          <span>Цена топлива, Р/т</span>
          <div className={styles.value}>XXXX</div>
        </div>
        <div className={styles.fourthBlock}>
          <span>Суммарная тепловая нагрузка, Гкал</span>
          <div className={styles.value}>
            {parametersMap?.TotalHeatLoad.value ? (
              <div className={styles.value}>
                {parametersMap.TotalHeatLoad.kks !== null && parseFloat(parametersMap.TotalHeatLoad.value).toFixed(2)}
                {parametersMap.TotalHeatLoad.kks === null && <>XXXX</>}
              </div>
            ) : (
              <SkeletonLoader width="50px" height="20px" />
            )}
          </div>
        </div>
        <div className={styles.fifthBlock}>
          <span>ТС, Р/кВт*ч</span>
          <div className={styles.value}>XXXX</div>
        </div>
      </div>

      <div className={styles.secondLine}>
        <div className={styles.sixthBlock}>
          <span>Температура сетевой воды, С</span>
          <div className={styles.subColumns}>
            <div className={styles.subColumn}>
              <span>Прямая</span>
              <div className={styles.value}>
                {parametersMap?.WaterTemperatureLeft.value ? (
                  <div className={styles.value}>
                    {parametersMap.WaterTemperatureLeft.kks !== null &&
                      parseFloat(parametersMap.WaterTemperatureLeft.value).toFixed(2)}
                    {parametersMap.WaterTemperatureLeft.kks === null && <>XXXX</>}
                  </div>
                ) : (
                  <SkeletonLoader width="50px" height="20px" />
                )}
              </div>
            </div>
            <div className={styles.subColumn}>
              <span>Обратная</span>
              <div className={styles.value}>
                {parametersMap?.WaterTemperatureRight.value ? (
                  <div className={styles.value}>
                    {parametersMap.WaterTemperatureRight.kks !== null &&
                      parseFloat(parametersMap.WaterTemperatureRight.value).toFixed(2)}
                    {parametersMap.WaterTemperatureRight.kks === null && <>XXXX</>}
                  </div>
                ) : (
                  <SkeletonLoader width="50px" height="20px" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.seventhBlock}>
          <span>Суммарный расход газа т/ч</span>
          <div className={styles.value}>
            {parametersMap?.totalGas.value ? (
              <div className={styles.value}>
                {parametersMap.totalGas.kks !== null && parseFloat(parametersMap.totalGas.value).toFixed(2)}
                {parametersMap.totalGas.kks === null && <>XXXX</>}
              </div>
            ) : (
              <SkeletonLoader width="50px" height="20px" />
            )}
          </div>
        </div>
        <div className={styles.eighthBlock}>
          <span>ТС, Р/кВт*ч</span>
          <div className={styles.value}>XXXX</div>
        </div>
      </div>

      <div className={styles.fourthLine}>
        <div className={styles.ninethBlock}>
          <span>Расход сетевой воды, т/ч</span>
          <div className={styles.subColumns}>
            <div className={styles.subColumn}>
              <span>Прямая</span>
              <div className={styles.value}>
                {parametersMap?.WaterConsumptionLeft.value ? (
                  <div className={styles.value}>
                    {parametersMap.WaterConsumptionLeft.kks !== null &&
                      parseFloat(parametersMap.WaterConsumptionLeft.value).toFixed(2)}
                    {parametersMap.WaterConsumptionLeft.kks === null && <>XXXX</>}
                  </div>
                ) : (
                  <SkeletonLoader width="50px" height="20px" />
                )}
              </div>
            </div>
            <div className={styles.subColumn}>
              <span>Обратная</span>
              <div className={styles.value}>
                {parametersMap?.WaterConsumptionRight.value ? (
                  <div className={styles.value}>
                    {parametersMap.WaterConsumptionRight.kks !== null &&
                      parseFloat(parametersMap.WaterConsumptionRight.value).toFixed(2)}
                    {parametersMap.WaterConsumptionRight.kks === null && <>XXXX</>}
                  </div>
                ) : (
                  <SkeletonLoader width="50px" height="20px" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tenthBlock}>
          <span>Температура наружного воздуха, С</span>
          <img src={Thermometer} alt="thermometer" />
          <div className={styles.value}>
            {parametersMap?.OutdoorAirTemperature.value ? (
              <div className={styles.value}>
                {parametersMap.WaterConsumptionRight.kks !== null &&
                  parseFloat(parametersMap.OutdoorAirTemperature.value).toFixed(2)}
                {parametersMap.WaterConsumptionRight.kks === null && <>XXXX</>}
              </div>
            ) : (
              <SkeletonLoader width="50px" height="16px" />
            )}
          </div>
        </div>
        <div className={styles.eleventhBlock}>
          <span>УРУТ на э/э, гут/кВтч</span>
          <div className={styles.value}>XXXX</div>
        </div>
      </div>
    </div>
  );
};

export default GeneralStationParameters;
