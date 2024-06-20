import { IStationEquipment } from "@/interface/stations";
import { createAsyncThunk } from "@reduxjs/toolkit";
// import { loginAndGetToken } from "./authService";

export const fetchDataGetDashBoard = createAsyncThunk(
  "schema/fetchDataGetDashBoard",
  async (data: { equipments: IStationEquipment[]; stationCode: string }, thunkAPI) => {
    try {
      // const token = await loginAndGetToken();
      const response = await fetch(`/api/${data.stationCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipments: data.equipments,
        }),
      });
      if (!response.ok) {
        throw new Error("Ошибка получения данных");
      }

      const jsonData = await response.json();

      const secondResponse = await fetch(`/api/${data.stationCode}/${jsonData}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!secondResponse.ok) {
        throw new Error("Ошибка получения данных");
      }
      const secondJsonData = await secondResponse.json();

      return secondJsonData.equipPrtResponses;
    } catch (error) {
      return thunkAPI.rejectWithValue("Ошибка получения данных");
    }
  }
);
