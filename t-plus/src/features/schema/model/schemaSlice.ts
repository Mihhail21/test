import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { initializeSchema } from "../api/initializeSchema";
// import { fetchDataGet } from "../api/fetchDataGet";
import { fetchSchemaData } from "../api/fetchSchemaData";
import { TransformedData } from "@/interface/TransformedData";



interface Ischema {
  blocks: TransformedData[];
  error: string | null;
  schemaDataId: number;
  data: TransformedData[];
}

const initialState: Ischema = {
  blocks: [],
  error: null,
  schemaDataId: 0,
  data: [],
};

const schemaSlice = createSlice({
  name: "schemaSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchemaData.pending, (state) => {
        // state.blocks = [];
        // state.schemaDataId = 0;
        state.error = null;
        state.data = [];
      })
      .addCase(
        fetchSchemaData.fulfilled,
        (state, action: PayloadAction<TransformedData[]>) => {
          state.data = action.payload;
        })
      .addCase(fetchSchemaData.rejected, (state, action) => {
        state.error = action.error && action.error.message ? action.error.message : 'Unknown error';
      })
      // .addCase(initializeSchema.pending, (state) => {
      //   // state.blocks = [];
      //   state.schemaDataId = 0;
      //   state.error = null;
      // })
      // .addCase(
      //   initializeSchema.fulfilled,
      //   (state, action: PayloadAction<number>) => {
      //     state.schemaDataId = action.payload;
      //   })
      // .addCase(initializeSchema.rejected, (state, action) => {
      //   state.error = action.error && action.error.message ? action.error.message : 'Unknown error';
      // })
      // .addCase(fetchDataGet.pending, (state) => {
      //   state.error = null;
      // })
      // .addCase(
      //   fetchDataGet.fulfilled,
      //   (state, action: PayloadAction<TransformedData[]>) => {
      //     state.blocks = action.payload;
      //   })
      // .addCase(fetchDataGet.rejected, (state, action) => {
      //   state.error = action.error && action.error.message ? action.error.message : 'Unknown error';
      // });
  },
});

export default schemaSlice;
