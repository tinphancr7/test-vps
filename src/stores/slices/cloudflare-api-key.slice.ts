/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */

import cloudflareApiKeyApi from "@/apis/cloudflare-api-key.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
  isLoading: boolean;
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
  result: any[];
}
// First, create the thunk
export const fetchCloudflareApiKey = createAsyncThunk(
  "cloudflare-api-key/fetchCloudflareApiKey",
  async (params: any) => {
    const response = await cloudflareApiKeyApi.callFetchCloudflareApiKey(
      params
    );

    return response?.data;
  }
);

const initialState: IState = {
  isLoading: true,
  meta: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  },
  result: [],
};

export const cloudflareApiKeySlide = createSlice({
  name: "cloudflare-api-key",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchCloudflareApiKey.pending, (state, _action) => {
      state.isLoading = true;
    });

    builder.addCase(fetchCloudflareApiKey.rejected, (state, _action) => {
      state.isLoading = false;
    });

    builder.addCase(fetchCloudflareApiKey.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isLoading = false;
        state.meta = action.payload.data.meta;
        state.result = action.payload.data.result;
      }
    });
  },
});

export const {} = cloudflareApiKeySlide.actions;

export default cloudflareApiKeySlide.reducer;
