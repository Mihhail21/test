import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchBranches } from "../api/fetchBranches";
import { IBranch, IBranches } from "@/interface/stations";

interface IBranchesState {
  items: IBranch[];
  error: string | null;
  isInitialized: boolean;
}

const initialState: IBranchesState = {
  items: [],
  error: null,
  isInitialized: false,
};

const branchesSlice = createSlice({
  name: "branchesSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.items = [];
        state.error = null;
        state.isInitialized = false;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<IBranches>) => {
        state.items = action.payload.branches;
        state.isInitialized = true;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.error = action.error && action.error.message ? action.error.message : "Unknown error";
        state.isInitialized = true;
      });
  },
});

export default branchesSlice;
