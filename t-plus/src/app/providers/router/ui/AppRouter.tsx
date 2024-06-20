import { routeConfig } from "@/shared/config/routeConfig/routeConfig";
import WidgetLoader from "@/widgets/WidgetLoader/WidgetLoader";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const AppRouter = () => {
  return (
    <Suspense fallback={<WidgetLoader />}>
      <Routes>
        {Object.values(routeConfig).map(({ element, path }) => (
          <Route key={path} element={element} path={path} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
