import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBranches = createAsyncThunk(
 "branches/fetchBranches",
 async (_, thunkAPI) => {
    try {
      const url = `/assets/data/stations.json?76`;
      const response = await fetch(url);
      const branchesData = await response.json();
      return branchesData;
    } catch (error) {
      return thunkAPI.rejectWithValue("Ошибка получения данных");
    }
 }
);
