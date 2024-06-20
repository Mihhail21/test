import { RouteProps } from "react-router-dom";
import { MainPageAsync } from "@/pages/MainPage/MainPage.async";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { SchemaPageAsync } from "@/pages/SchemaPage/ui/SchemaPage.async";
import { DashBoardMainAsync } from "@/pages/DashBoardMain/DashBoardMain.async";
import Transliteration from "@/pages/Transliteration";

export enum AppRoutes {
  MAIN = "main",
  SCHEMA = "schema",
  TABLE = "table",
  NOT_FOUND = "not_found",
  TRANSLITERATE = "transliterate",
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: "/",
  [AppRoutes.TABLE]: "/:branchCode/:stationCode",

  [AppRoutes.SCHEMA]: "/:branchCode/:stationCode/:schemaCode",
  [AppRoutes.NOT_FOUND]: "*",
  [AppRoutes.TRANSLITERATE]: "/transliterate",
};

export const routeConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <MainPageAsync />,
  },
  [AppRoutes.SCHEMA]: {
    path: RoutePath.schema,
    element: <SchemaPageAsync />,
  },
  [AppRoutes.TABLE]: {
    path: RoutePath.table,
    element: <DashBoardMainAsync />,
  },
  [AppRoutes.TABLE]: {
    path: RoutePath.table,
    element: <DashBoardMainAsync />,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePath.not_found,
    element: <NotFoundPage />,
  },
  [AppRoutes.TRANSLITERATE]: {
    path: RoutePath.transliterate,
    element: <Transliteration />,
  },
};
