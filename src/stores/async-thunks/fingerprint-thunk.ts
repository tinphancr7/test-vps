import fingerPrintApis from "@/apis/fingerprint-api";

import { createAsyncThunk } from "@reduxjs/toolkit";

type Pagination = {
  total: number;
  fingerprints: Array<any>;
};

export const asyncThunkPaginationFingerPrints = createAsyncThunk<
  Pagination,
  any
>("/fingerprint/get-paging-fingerprint", async (query, { rejectWithValue }) => {
  try {
    const { data } = await fingerPrintApis.getPaginationUsers(query);
    console.log("data: ", data);
    if (data?.status === "SUCCESS") {
      return {
        total: data?.total,
        fingerprints: data?.fingerprints,
      } as Pagination;
    }

    return rejectWithValue("Invalid data format");
  } catch (error) {
    return rejectWithValue(error);
  }
});
