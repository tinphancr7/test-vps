import vpsOrtherApis from "@/apis/vps-orther.api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const asyncThunkGetDetaiVpsOrtherById = createAsyncThunk<any, string>(
  "/vps-orther/get-detailvps",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await vpsOrtherApis.getDetailVps(id);
      return data?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
