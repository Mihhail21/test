import { FC } from "react";
import { AppRouter } from "./app/providers/router";
import "../src/app/styles/index.scss";

const App: FC = () => {
  return (
    <>
      <AppRouter/>
    </>
  );
};

export default App;
