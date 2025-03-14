import manage2FaKeyApi from "@/apis/manage_2_fa_key.api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// First, create the thunk
export const fetchManage2FaKey = createAsyncThunk(
  "manage_2_fa_key/fetchKey",
  async ({ search, page, limit }: any) => {
    const response = await manage2FaKeyApi.callFetchKey({
      search,
      page,
      limit,
    });
    return response?.data;
  },
);
