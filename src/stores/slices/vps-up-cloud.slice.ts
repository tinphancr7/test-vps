import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkPaginationVpsBuCloudUpCloud } from "../async-thunks/up-cloud.thunk";

const initialState = {
  vpsList: [],
  total: 0,
  totalMoney: 0,
  isLoading: false,
  isSubmitting: false,
  status: "",
  teamSelected: null,
  searchByIp: "",
  productName: "",
  dateRange: {
    startDate: undefined,
    endDate: undefined,
  },
};

const vpsBuCloudUpCloudSlice = createSlice({
  name: "vpsUpCloud",
  initialState,
  reducers: {
    setRangeDate: (state, action) => {
      state.dateRange = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    setTeamSelected: (state, action) => {
      state.teamSelected = action.payload;
    },

    setSearchByIp: (state, action) => {
      state.searchByIp = action.payload;
    },

    setProductName: (state, action) => {
      state.productName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase('resetState', (state) => {
      //     state.status = new Set([]);
      //     state.teamSelected = null;
      //     state.searchByIp = "";
      // })

      .addCase(asyncThunkPaginationVpsBuCloudUpCloud.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        asyncThunkPaginationVpsBuCloudUpCloud.fulfilled,
        (state, action) => {
          state.vpsList =
            action.payload.data?.map((it: any) => ({
              ...it,
              total: it?.vps_id?.total,
            })) || [];

          state.total = action.payload.total;
          state.totalMoney = action.payload.totalMoney;
          state.isLoading = false;
        }
      )
      .addCase(asyncThunkPaginationVpsBuCloudUpCloud.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setStatus,
  setTeamSelected,
  setSearchByIp,
  setProductName,
  setRangeDate,
} = vpsBuCloudUpCloudSlice.actions;

export default vpsBuCloudUpCloudSlice.reducer;
