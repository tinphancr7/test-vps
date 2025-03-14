import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkGetDetaiVpsOrtherById } from "../async-thunks/detail-vps-orther-thunk";
const initialState: any = {
  data: {},
  isLoading: false,
};
const detailVpsSlice = createSlice({
  name: "detailVps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncThunkGetDetaiVpsOrtherById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkGetDetaiVpsOrtherById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(asyncThunkGetDetaiVpsOrtherById.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// export const { setUsers } = detailVpsSlice.actions;

export default detailVpsSlice.reducer;
