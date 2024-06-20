import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EquipmentData } from "@/pages/DashBoardMain/DashBoardMain";
import { fetchDataGetDashBoard } from "../api/fetchDashBoard";

interface IDashBoard {
  dashBoard: EquipmentData[];
  error: string | null;
  isInitialized: boolean;
}

const initialState: IDashBoard = {
  dashBoard: [],
  error: null,
  isInitialized: false,
};

const dashBoardSlice = createSlice({
  name: "dashBoardSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataGetDashBoard.pending, (state) => {
        state.dashBoard = [];
        state.error = null;
        state.isInitialized = false;
      })
      .addCase(
        fetchDataGetDashBoard.fulfilled,
        (state, action: PayloadAction<EquipmentData[]>) => {
          state.dashBoard = action.payload;
          state.isInitialized = true;
        }
      )
      .addCase(fetchDataGetDashBoard.rejected, (state, action) => {
        state.error = action.error && action.error.message ? action.error.message : 'Unknown error';
        state.isInitialized = true;
      });
  },
});

export default dashBoardSlice;