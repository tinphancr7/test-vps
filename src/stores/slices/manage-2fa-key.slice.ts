/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { createSlice } from "@reduxjs/toolkit";
import { fetchManage2FaKey } from "../async-thunks/manage_2_fa_key.thunk";

interface IState {
  isLoading: boolean;
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
  result: any[];
  data_2fa_key: Array<any>;
}

const initialState: IState = {
  isLoading: true,
  meta: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  },
  result: [],
  data_2fa_key: [],
};

export const manage2fakeySlide = createSlice({
  name: "manage_2_fa_key",
  initialState,

  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchManage2FaKey.pending, (state, _action) => {
      state.isLoading = true;
    });

    builder.addCase(fetchManage2FaKey.rejected, (state, _action) => {
      state.isLoading = false;
    });

    builder.addCase(fetchManage2FaKey.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isLoading = false;
        state.meta = action.payload.data.meta;
        state.result = action.payload.data.result;
      }
    });
  },
});

export const {} = manage2fakeySlide.actions;

export default manage2fakeySlide.reducer;
