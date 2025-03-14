import serverVietServerApis, {
  GetPagingServerVietServer,
} from "@/apis/server-vietserver-api";
import { createAsyncThunk } from "@reduxjs/toolkit";

type PayloadServerVietServer = {
  data: Array<any>;
  total: number;
  totalPages: number;
};

export const asyncThunkPaginationServerVietServer = createAsyncThunk<
  PayloadServerVietServer,
  GetPagingServerVietServer
>("/server-vietServer/get-paging", async (query, { rejectWithValue }) => {
  try {
    const { data } = await serverVietServerApis.getPagingServerVietServer({
      ...query,
    });

    return {
      data: data?.data,
      total: data?.counts,
      totalPages: data?.totalPages,
    } as PayloadServerVietServer;
  } catch (error) {
    return rejectWithValue(error);
  }
});
