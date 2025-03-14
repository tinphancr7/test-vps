import prodsBucloudApi from "@/apis/product-bucloud-apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

type PayloadProdBucloud = {
  status: number;
  data: any;
};

export const asyncThunkGetAllProducts = createAsyncThunk<PayloadProdBucloud>(
  "/product-bucloud/get-products",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await prodsBucloudApi.getAllProducts();

      if (data?.status === 1) {
        return {
          status: data?.status,
          data: data?.data,
        } as PayloadProdBucloud;
      }

      return rejectWithValue("Invalid data format");
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const asyncThunkGetProductById = createAsyncThunk<
  PayloadProdBucloud,
  string
>("/product-bucloud/get-product-by-id", async (id, { rejectWithValue }) => {
  try {
    const { data } = await prodsBucloudApi.getProductById(id);

    if (data?.status === 1) {
      return {
        status: data?.status,
        data: data?.data,
      } as PayloadProdBucloud;
    }

    return rejectWithValue("Invalid data format");
  } catch (error) {
    return rejectWithValue(error);
  }
});
