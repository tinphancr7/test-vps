import { createSlice } from "@reduxjs/toolkit";
import { VpsBuCloudState } from "@/interfaces/vps-bu-cloud";
import { asyncThunkPaginationVpsBuCloud } from "../async-thunks/vps-bu-cloud-thunk";

const initialState: VpsBuCloudState = {
  vpsList: [],
  total: 0,
  totalMoney: 0,
  isLoading: false,
  isSubmitting: false,
  status: "",
  site: null,
  teamSelected: null,
  searchByIp: "",
  productName: "",
  dueDate: "",
  os: "",
  search: {},
  dateRange: {
    startDate: undefined,
    endDate: undefined,
  },
};

const vpsBuCloudSlice = createSlice({
  name: "vpsBuCloud",
  initialState,
  reducers: {
    setRangeDate: (state, action) => {
      state.dateRange = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    setSite: (state, action) => {
      state.site = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
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
    setDueDate: (state, action) => {
      state.dueDate = action.payload;
    },
    setOs: (state, action) => {
      state.os = action.payload;
    },

    resetFilter: (state) => {
      state.status = "";
      state.teamSelected = null;
      state.searchByIp = "";
      state.productName = "";
      state.dateRange = {
        startDate: undefined,
        endDate: undefined,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase('resetState', (state) => {
      //     state.status = new Set([]);
      //     state.teamSelected = null;
      //     state.searchByIp = "";
      // })

      .addCase(asyncThunkPaginationVpsBuCloud.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkPaginationVpsBuCloud.fulfilled, (state, action) => {
        state.vpsList =
          action.payload.data?.map((it: any) => ({
            ...it,
            total: it?.vps_id?.total,
          })) || [];

        state.total = action.payload.total;
        state.totalMoney = action.payload.totalMoney;
        state.isLoading = false;
      })
      .addCase(asyncThunkPaginationVpsBuCloud.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setStatus,
  setSite,
  setTeamSelected,
  setSearchByIp,
  setProductName,
  resetFilter,
  setDueDate,
  setSearch,
  setOs,
  setRangeDate,
} = vpsBuCloudSlice.actions;

export default vpsBuCloudSlice.reducer;
