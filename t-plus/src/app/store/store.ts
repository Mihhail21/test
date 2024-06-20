import branchesSlice from "@/features/schema/model/branchesSlice";
import dashBoardSlice from "@/features/schema/model/dashBoardSlice";
import schemaSlice from "@/features/schema/model/schemaSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    schema: schemaSlice.reducer,
    dashBoard: dashBoardSlice.reducer,
    branches: branchesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
