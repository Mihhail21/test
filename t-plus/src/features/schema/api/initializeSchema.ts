// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { convertToRequest } from "../../../shared/utils/convertRequest";
// import { TransformedData } from "@/interface";

// export const loginAndGetToken = async () => {
//   const response = await fetch("/authorization", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: "instructor",
//       password: "",
//     }),
//   });
//   if (!response.ok) {
//     throw new Error("Ошибка авторизации");
//   }
//   const data = await response.json();
//   return data.accessToken;
// };

// export const initializeSchema = createAsyncThunk(
//   "schema/fetchDataInitial",
//   async (data: { data: TransformedData[]; defaultStationCode: string }, thunkAPI) => {
//     console.log(data.data, '333');
    
//     const { rejectWithValue } = thunkAPI;
//     try {
//       const token = await loginAndGetToken();
//       const convertedData = convertToRequest(data.data);
//       const response = await fetch(`/api/${data.defaultStationCode}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(convertedData),
//       });

//       if (!response.ok) {
//         throw new Error("Ошибка получения данных");
//       }
//       const schemaDataId = await response.json();
//       return schemaDataId;
//     } catch (error) {
//       return rejectWithValue((error as Error).message || "Ошибка получения данных");
//     }
//   }
// );
