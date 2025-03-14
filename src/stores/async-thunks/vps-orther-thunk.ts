import vpsOrtherApis from "@/apis/vps-orther.api";
import { createAsyncThunk } from "@reduxjs/toolkit";

type PayloadVps = {
  data: Array<any>;
  total: number;
  totalMoney: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
};

export const asyncThunkPaginationVpsOrther = createAsyncThunk<PayloadVps, any>(
  "/vps-orther/get-paging",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await vpsOrtherApis.getPaging({
        ...query,
      });

      return {
        data: data?.data,
        totalMoney: data?.totalMoney,
        total: data?.total,
        pageIndex: data?.pageIndex,
        pageSize: data?.pageSize,
        totalPages: data?.totalPages,
      } as PayloadVps;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
