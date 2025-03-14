import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkGetAllProducts } from "../async-thunks/prod-general-thunk";

const initialState = {
  products: [],
  product: {},
  total: 0,
  isLoading: false,
};

const prodGeneralSlice = createSlice({
  name: "prodGeneral",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Products VNG
      .addCase(asyncThunkGetAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkGetAllProducts.fulfilled, (state, action) => {
        state.products = action.payload.data;
        state.isLoading = false;
      })
      .addCase(asyncThunkGetAllProducts.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default prodGeneralSlice.reducer;
