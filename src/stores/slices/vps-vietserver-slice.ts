import { createSlice } from "@reduxjs/toolkit";

import { VpsVietServerState } from "@/interfaces/vps-vietserver-state";
import { asyncThunkPaginationVpsVietServer } from "../async-thunks/vps-vietserver-thunk";

const initialState: VpsVietServerState = {
  vpsList: [],
  total: 0,
  totalMoney: 0,
  isLoading: false,
  isSubmitting: false,
  status: "",
  teamSelected: null,
  searchByIp: "",
  productName: "",
  site: null,
  dueDate: "",
  os: "",
  dateRange: {
    startDate: undefined,
    endDate: undefined,
  },
  search: {},
};

const vpsVngSlice = createSlice({
  name: "vpsVietServer",
  initialState,
  reducers: {
    setRangeDate: (state, action) => {
      state.dateRange = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSite: (state, action) => {
      state.site = action.payload;
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

      .addCase(asyncThunkPaginationVpsVietServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkPaginationVpsVietServer.fulfilled, (state, action) => {
        state.vpsList = action.payload.data?.map((it: any) => ({
          ...it,
          total: it?.vps_id?.total,
        }));
        state.total = action.payload.total;
        state.totalMoney = action.payload.totalMoney;
        state.isLoading = false;
      })
      .addCase(asyncThunkPaginationVpsVietServer.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setStatus,
  setTeamSelected,
  setSearchByIp,
  setProductName,
  resetFilter,
  setSite,
  setDueDate,
  setSearch,
  setOs,
  setRangeDate,
} = vpsVngSlice.actions;

export default vpsVngSlice.reducer;
