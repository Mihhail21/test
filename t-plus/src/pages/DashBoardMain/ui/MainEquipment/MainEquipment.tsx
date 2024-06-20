import { useEffect, useState } from "react";
import { useAppSelector } from "@/shared/model/useReduxHooks";
import styles from "./MainEquipment.module.scss";
import SkeletonLoader from "@/shared/ui/SkeletonLoader/SkeletonLoader";
import { IBranch, IStation, IStationEquipmentExtended } from "@/interface/stations";
import { EquipmentData } from "../../DashBoardMain";
import { useParams } from "react-router-dom";

interface IStationEquipmentView {
  title: string;
  kks: string;
  sample: string;
  value: string | null;
  recommendedValue: string;
}

const MainEquipment = () => {
  const { branchCode, stationCode } = useParams();

  const branches = useAppSelector((state) => state.branches.items);
  const dashBoard = useAppSelector((state) => state.dashBoard.dashBoard);
  const isDashboardInitialized = useAppSelector((state) => state.dashBoard.isInitialized);

  const [equipments, setEquipments] = useState<IStationEquipmentView[]>([]);

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
      const items: IStationEquipmentView[] = station.dashboard.mainEquipments
        .filter((e: IStationEquipmentExtended) => e.samples.includes(EQUIPMENT_SAMPLE))
        .map((e: IStationEquipmentExtended) => {
          const value = isDashboardInitialized ? findEquipmentValue(e.kks, EQUIPMENT_SAMPLE, dashBoard) || null : null;
          return {
            title: e.title,
            kks: e.kks,
            sample: EQUIPMENT_SAMPLE,
            value,
            recommendedValue: "XXX,X",
          } as IStationEquipmentView;
        });
      setEquipments(items);
    }
  }, [isDashboardInitialized]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Основное оборудование</h1>
      <div className={styles.line}></div>
      <div className={styles.columns}>
        <div className={styles.column}>
          <div className={styles.firstHeader}>Наименование оборудования</div>
          {equipments.map((equipment: IStationEquipmentView, index: number) => (
            <div className={styles.firstColumn} key={`${index}-title`}>
              {index + 1}.{equipment.title}
            </div>
          ))}
        </div>
        <div className={styles.column}>
          <div className={styles.header}>Значение со станции</div>
          {equipments.map((equipment: IStationEquipmentView, index: number) => {
            return (
              <div className={styles.value} key={`${index}-value`}>
                {equipment.value ? (
                  <div>
                    {equipment.kks !== null && parseFloat(equipment.value).toFixed(2)}
                    {equipment.kks == null && <>XXX,X</>}
                  </div>
                ) : (
                  <SkeletonLoader width="50px" height="18px" />
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.column}>
          <div className={styles.header}>Рекомендация (опт часовые)</div>
          {equipments.map((equipment: IStationEquipmentView, index: number) => {
            return (
              <div className={styles.value} key={`${index}-recommended`}>
                {equipment.recommendedValue ? (
                  <div>{equipment.recommendedValue}</div>
                ) : (
                  <SkeletonLoader width="50px" height="18px" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainEquipment;
