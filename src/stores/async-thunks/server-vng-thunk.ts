import serverVngApis, { GetPagingServerVng } from "@/apis/server-vng-api";
import { createAsyncThunk } from "@reduxjs/toolkit";

type PayloadServerVng = {
  data: Array<any>;
  total: number;
  totalPages: number;
};

export const asyncThunkPaginationServerVng = createAsyncThunk<
  PayloadServerVng,
  GetPagingServerVng
>("/server-vng/get-paging", async (query, { rejectWithValue }) => {
  try {
    const { data } = await serverVngApis.getPagingServerVng({
      ...query,
    });

    return {
      data: data?.data,
      total: data?.counts,
      totalPages: data?.totalPages,
    } as PayloadServerVng;
  } catch (error) {
    return rejectWithValue(error);
  }
});
