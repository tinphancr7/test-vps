import digitalOceanSizeApi from "@/apis/digital-ocean-size.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DigitalOceanSize {
  listSizes: object;
  isLoading: boolean;
  selectedSize: object;
}
const initialState: DigitalOceanSize = {
  listSizes: {},
  selectedSize: {},
  isLoading: false,
};

export const getAllListSize = createAsyncThunk(
  "digital-ocean/sizes/get-all",
  async () => {
    const response = await digitalOceanSizeApi.getAllListSize();
    return response?.data;
  }
);
const digitalOceanSizeSlice = createSlice({
  name: "digitalOceanSizeSlice",
  initialState,
  reducers: {
    setDataSizeDigitalOcean: (state: any, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (action.payload[key] !== undefined) {
          state[key] = action.payload[key];
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Pagination Users
      .addCase(getAllListSize.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllListSize.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listSizes = action.payload.data;
      })
      .addCase(getAllListSize.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setDataSizeDigitalOcean } = digitalOceanSizeSlice.actions;

export default digitalOceanSizeSlice.reducer;
