import { createSlice } from "@reduxjs/toolkit";
import { ServerVngState } from "@/interfaces/server-vng-state";
import { asyncThunkPaginationServerVietServer } from "../async-thunks/server-vietserver-thunk";

const initialState: ServerVngState = {
  serverList: [],
  total: 0,
  isLoading: false,
  isSubmitting: false,
};

const vpsVietServerSlice = createSlice({
  name: "servervietserver",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncThunkPaginationServerVietServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        asyncThunkPaginationServerVietServer.fulfilled,
        (state, action) => {
          state.serverList = action.payload.data;
          state.total = action.payload.total;
          state.isLoading = false;
        }
      )
      .addCase(asyncThunkPaginationServerVietServer.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// export const { setUsers } = vpsVietServerSlice.actions;

export default vpsVietServerSlice.reducer;
