import { Stage, Layer, Rect } from "react-konva";
import { useEffect, FC } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/model/useReduxHooks";
import Blocks from "@/features/schema/model/Blocks";
import { fetchSchemaData } from "@/features/schema/api/fetchSchemaData";
// import { initializeSchema } from "@/features/schema/api/initializeSchema";
// import { fetchDataGet } from "@/features/schema/api/fetchDataGet";
import Navbar from "@/widgets/Navbar/Navbar";
import { fetchBranches } from "@/features/schema/api/fetchBranches";
import { IBranch, IStation, IStationCategory, IStationSchema } from "@/interface/stations";

interface SchemaPageProps {
  scaleX?: number;
  scaleY?: number;
  main?: string;
  height?: number;
  width?: number;
}

const SchemaPage: FC<SchemaPageProps> = ({ scaleX = 0.98, scaleY = 0.92, main, height, width }) => {
  const { branchCode, stationCode, schemaCode } = useParams<{
    branchCode: string;
    stationCode: string;
    schemaCode: string;
  }>();

  const blocks = useAppSelector((state) => state.schema.blocks);
  const schemaDataId = useAppSelector((state) => state.schema.schemaDataId);
  const error = useAppSelector((state) => state.schema.error);
  const data = useAppSelector((state) => state.schema.data);
  const branchesState = useAppSelector((state) => state.branches);
  const dispatch = useAppDispatch();

  const defaultBranchCode = branchCode || "";
  const defaultStationCode = stationCode ?? "";
  const defaultSchemaCode = schemaCode || "";

  useEffect(() => {
    const clearOldRequests = () => {
      const currentTime = Date.now();
      const oneMinuteAgo = currentTime - 20000; 
      const requests = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const recentRequests = requests.filter((request) => request.responseEnd >= oneMinuteAgo);
      recentRequests.forEach(() => performance.clearResourceTimings());
    };
    const intervalId = setInterval(clearOldRequests, 20000); 
    return () => clearInterval(intervalId);
  }, []);

  const findCategory = (branchCode: string, stationCode: string, schemaCode: string) => {
    const foundBranch = branchesState.items.find((branch: IBranch) => branch.code === branchCode) || null;
    const foundStation = foundBranch?.stations.find((station: IStation) => station.code === stationCode) || null;
    const foundCategory =
      foundStation?.categories.find((category: IStationCategory) =>
        category.schemas.some(
          (schema: IStationSchema) =>
            schema.code === schemaCode ||
            (schema.subSchemas && schema.subSchemas.some((subSchema: IStationSchema) => subSchema.code === schemaCode))
        )
      ) || null;
    return foundCategory;
  };

  useEffect(() => {
    if (!branchesState.isInitialized) {
      dispatch(fetchBranches());
    }
  }, []);

  useEffect(() => {
    if (!branchesState.isInitialized) {
      return;
    }

    if (main) {
      const mainSchemaCode = `${branchCode}/${stationCode}/main`;
      dispatch(fetchSchemaData(mainSchemaCode));
    } else {
      const category = findCategory(defaultBranchCode, defaultStationCode, defaultSchemaCode);

      if (category) {
        const fullSchemaCode = `${branchCode}/${stationCode}/${category.code}/${schemaCode}`;
        dispatch(fetchSchemaData(fullSchemaCode));
      }
    }
  }, [main, schemaCode, branchesState.isInitialized, defaultBranchCode]);

  // useEffect(() => {
  //   const schemaInitializationPayload = { data, defaultStationCode };
  //   dispatch(initializeSchema(schemaInitializationPayload));
  // }, [data]);

  // useEffect(() => {
  //   if (schemaDataId) {
  //     dispatch(fetchDataGet({ schemaDataId, stationCode, blocks: data }));

  //     const intervalId = setInterval(() => {
  //       dispatch(fetchDataGet({ schemaDataId, stationCode, blocks: data }));
  //     }, 500);

  //     return () => clearInterval(intervalId);
  //   }
  // }, [schemaDataId, data, stationCode]);

  //   useEffect(() => {
  //   let isMounted = true;
  //   const fetchDataWithDelay = async () => {
  //     try {
  //       if (isMounted) {
  //         await dispatch(fetchDataGet({ schemaDataId, stationCode, blocks: data }));
  //         setTimeout(fetchDataWithDelay, 1000);
  //       }
  //     } catch (error) {
  //       console.error("Ошибка при получении данных:", error);
  //       setTimeout(fetchDataWithDelay, 1000);
  //     }
  //   };
  //   if (schemaDataId) {
  //     setTimeout(fetchDataWithDelay, 1500);
  //   }
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [dispatch, schemaDataId, data]);

  return (
    <>
      {!main && <Navbar />}
      <Stage width={width || 1920} height={height || 1000} scaleX={scaleX} scaleY={scaleY}>
        <Layer name="top-layer">
          <Rect width={(width || 1920) / scaleX} height={(height || 1080) / scaleY} fill="#252b37" />
          {!error && <Blocks blocks={data} />}
        </Layer>
      </Stage>
    </>
  );
};

export default SchemaPage;
