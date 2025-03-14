// src/store/slices/zoneSlice.ts
import { Zone } from "@/interfaces/upcloud-response.interface";
import { fetchZones } from "@/stores/async-thunks/up-cloud.thunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ZoneState {
  zones: Zone[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: ZoneState = {
  zones: null,
  loading: false,
  error: null,
};

const zoneSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {
    // Additional synchronous actions can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchZones.fulfilled, (state, action: PayloadAction<Zone[]>) => {
        state.zones = action.payload;
        state.loading = false;
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default zoneSlice.reducer;
