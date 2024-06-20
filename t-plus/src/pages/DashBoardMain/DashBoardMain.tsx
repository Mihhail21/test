import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./DashBoardMain.module.scss";
import MainEquipment from "./ui/MainEquipment/MainEquipment";
import GeneralStationParameters from "./ui/GeneralStationParameters/GeneralStationParameters";
import BalanceProfile from "./ui/BalanceProfile/BalanceProfile";
import WrapperSchemaPage from "./ui/WrapperSchemaPage/WrapperSchemaPage";
import { fetchDataGetDashBoard } from "@/features/schema/api/fetchDashBoard";
import { useAppDispatch, useAppSelector } from "@/shared/model/useReduxHooks";
import { fetchBranches } from "@/features/schema/api/fetchBranches";
import Navbar from "@/widgets/Navbar/Navbar";
import { IBranch, IStation, IStationDashboard, IStationEquipment } from "@/interface/stations";

export interface EquipmentData {
  kks: string;
  samples: { sample: string; value: string }[];
}
const DashBoardMain = () => {
  const dispatch = useAppDispatch();
  const isStationsInitialized = useAppSelector((state) => state.branches.isInitialized);
  const branches = useAppSelector((state) => state.branches.items);

  const { branchCode, stationCode } = useParams();

  const findStation = (branchCode: string, stationCode: string) => {
    const foundBranch = branches.find((branch: IBranch) => branch.code === branchCode) || null;
    return foundBranch ? foundBranch.stations.find((station: IStation) => station.code === stationCode) || null : null;
  };

  const collectEquipments = (dashboard: IStationDashboard): IStationEquipment[] => {
    const commonParametersEquipments: IStationEquipment[] = Object.values(dashboard.commonParameters);
    const mainEquipments: IStationEquipment[] = dashboard.mainEquipments.map((equipmentExtended) => {
      const { title, ...equipment } = equipmentExtended;
      return {
        kks: equipment.kks,
        sys: equipment.sys,
        samples: equipment.samples,
      };
    });

    return [...commonParametersEquipments, ...mainEquipments];
  };

  useEffect(() => {
    if (!isStationsInitialized) {
      dispatch(fetchBranches());
    } else {
      if (branchCode && stationCode) {
        const station = findStation(branchCode, stationCode);
        if (station) {
          const equipments = collectEquipments(station.dashboard);
          if (equipments.length > 0) {
            const equipmentFetchData = { equipments, stationCode };
            dispatch(fetchDataGetDashBoard(equipmentFetchData));
          }
        }
      }
    }
  }, [isStationsInitialized]);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.section}>
            <GeneralStationParameters />
          </div>
          <div className={styles.section}>
            <BalanceProfile />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.section}>
            <MainEquipment />
          </div>
          <div className={styles.section}>
            <WrapperSchemaPage />
          </div>
        </div>
      </div>
    </>
  );
};
export default DashBoardMain;
