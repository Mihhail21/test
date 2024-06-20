import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseXml } from "../model/parseXml";

export const fetchSchemaData = createAsyncThunk("schema/fetchDataJson", async (code: string | undefined, thunkAPI) => {
  try {
    const url = `/assets/data2/${code}.fxml?76`;
    const response = await fetch(url);
    const xmlText = await response.text();
    const parsedElements = parseXml(xmlText);    
    return parsedElements;
  } catch (error) {
    return thunkAPI.rejectWithValue("Ошибка получения данных");
  }
});
