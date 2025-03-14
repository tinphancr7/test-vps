import digitalOceanRegionApi from "@/apis/digital-ocean-region.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
interface RegionI {
  _id?: string;
  continent?: string;
  data_centers?: Array<string>;
  flag?: string;
  label?: string;
  slug?: string;
}
interface DigitalOceanRegion {
  listRegion: [];
  selectedRegion: RegionI;
  selectedDataCenter: any;
  isLoading: boolean;
}
const initialState: DigitalOceanRegion = {
  selectedRegion: {},
  listRegion: [],
  isLoading: false,
  selectedDataCenter: new Set([]),
};

export const getAllListRegion = createAsyncThunk(
  "digital-ocean/regions/get-all",
  async () => {
    const response = await digitalOceanRegionApi.getAllListRegion();
    return response?.data;
  }
);
const digitalOceanRegionSlice = createSlice({
  name: "digitalOceanRegionSlice",
  initialState,
  reducers: {
    setDataRegion: (state: any, action) => {
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
      .addCase(getAllListRegion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllListRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listRegion = action.payload.data;
        state.selectedRegion = action.payload.data[0];
        state.selectedDataCenter = new Set([
          action.payload.data[0].data_centers[0],
        ]);
      })
      .addCase(getAllListRegion.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setDataRegion } = digitalOceanRegionSlice.actions;

export default digitalOceanRegionSlice.reducer;
