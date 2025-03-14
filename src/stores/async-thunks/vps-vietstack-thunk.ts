import { VpsTypeEnum } from "./../../constants/enum";
import vpsApis, { GetPagingVps } from "@/apis/vps-apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

type PayloadVps = {
  totalMoney: number;
  data: Array<any>;
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
};

export const asyncThunkPaginationVpsVietStack = createAsyncThunk<
  PayloadVps,
  GetPagingVps
>("/vps-vietstack/get-paging", async (query, { rejectWithValue }) => {
  try {
    const { data } = await vpsApis.getPagingVpsVietStackOrVng({
      ...query,
      type: VpsTypeEnum.VIET_STACK,
    });

    return {
      data: data?.data,
      total: data?.total,
      pageIndex: data?.pageIndex,
      pageSize: data?.pageSize,
      totalPages: data?.totalPages,
      totalMoney: data?.totalMoney,
    } as PayloadVps;
  } catch (error) {
    return rejectWithValue(error);
  }
});
