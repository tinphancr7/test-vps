/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */

import accountApi from "@/apis/account.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
  isLoading: boolean;
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
  topFilter: {
    provider?: string;
  };
  result: any[];
}

export const fetchWalletAccount = createAsyncThunk(
  "wallet/fetchWalletAccount",
  async (params: any) => {
    const response = await accountApi.callFetchAccount(params);
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
  topFilter: {},
  result: [],
};

export const walletSlide = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setTopFilter: (payload, action) => {
      console.log({
        ...action.payload,
      });
      payload.topFilter = {
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWalletAccount.pending, (state, _action) => {
      state.isLoading = true;
    });

    builder.addCase(fetchWalletAccount.rejected, (state, _action) => {
      state.isLoading = false;
    });

    builder.addCase(fetchWalletAccount.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isLoading = false;
        state.meta = action.payload.data.meta;
        state.result = action.payload.data.result;
      }
    });
  },
});
export const { setTopFilter } = walletSlide.actions;
export default walletSlide.reducer;
