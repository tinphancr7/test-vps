import { createSlice } from "@reduxjs/toolkit";
import {
  asyncThunkGetAllProducts,
  asyncThunkGetProductById,
} from "../async-thunks/prod-bucloud-thunk";

const initialState = {
  products: [],
  product: {},
  total: 0,
  isLoading: false,
};

const prodBucloudSlice = createSlice({
  name: "prodBucloud",
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
      })

      // Get All Products VNG
      .addCase(asyncThunkGetProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkGetProductById.fulfilled, (state, action) => {
        state.product = action.payload.data;
        state.isLoading = false;
      })
      .addCase(asyncThunkGetProductById.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default prodBucloudSlice.reducer;
