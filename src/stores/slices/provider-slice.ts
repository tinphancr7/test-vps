import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkPaginationProviders } from "../async-thunks/provider-thunk";

const initialState = {
    providersList: [],
    total: 0,
    isLoading: false,
    isSubmitting: false,
    search: '',
};

const providerSlice = createSlice({
    name: "provider",
    initialState,
    reducers: {
      setSearch: (state, action) => {
        state.search = action.payload;
      }
    },
  extraReducers: (builder) => {
    builder
      .addCase(asyncThunkPaginationProviders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkPaginationProviders.fulfilled, (state, action) => {
        state.providersList = action.payload.data;
        state.total = action.payload.total;
        state.isLoading = false;
      })
      .addCase(asyncThunkPaginationProviders.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setSearch } = providerSlice.actions;

export default providerSlice.reducer;
