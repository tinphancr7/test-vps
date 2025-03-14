import prodGeneralApis from "@/apis/product-general-apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

type PayloadProd = {
  status: number;
  data: any;
};

export const asyncThunkGetAllProducts = createAsyncThunk<PayloadProd>(
  "/product-general/get-products",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await prodGeneralApis.getAllProducts();

      if (data?.status === 1) {
        return {
          status: data?.status,
          data: data?.data,
        } as PayloadProd;
      }

      return rejectWithValue("Invalid data format");
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
