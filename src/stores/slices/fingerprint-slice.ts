import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkPaginationFingerPrints } from "../async-thunks/fingerprint-thunk";
import { FingerPrintsState } from "@/interfaces/fingerprint-state";

const initialState: FingerPrintsState = {
  fingerprints: [],
  total: 0,
  isLoading: false,
  isSubmitting: false,
};

const fingerPrintSlice = createSlice({
  name: "fingerprints",
  initialState,
  reducers: {
    setFingerPrints: (state, action) => {
      state.fingerprints = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Pagination Users
      .addCase(asyncThunkPaginationFingerPrints.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkPaginationFingerPrints.fulfilled, (state, action) => {
        state.fingerprints = action.payload.fingerprints;
        state.total = action.payload.total;
        state.isLoading = false;
      })
      .addCase(asyncThunkPaginationFingerPrints.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setFingerPrints } = fingerPrintSlice.actions;

export default fingerPrintSlice.reducer;
