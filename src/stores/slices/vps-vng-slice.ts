import { VpsVngState } from "@/interfaces/vps-vng-state";
import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkPaginationVpsVng } from "../async-thunks/vps-vng-thunk";

const initialState: VpsVngState = {
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

const vpsVngSlice = createSlice({
  name: "vpsVng",
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
    setDueDate: (state, action) => {
      state.dueDate = action.payload;
    },
    setProductName: (state, action) => {
      state.productName = action.payload;
    },
    setOs: (state, action) => {
      state.os = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase('resetState', (state) => {
      //     state.status = new Set([]);
      //     state.teamSelected = null;
      //     state.searchByIp = "";
      // })

      .addCase(asyncThunkPaginationVpsVng.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkPaginationVpsVng.fulfilled, (state, action) => {
        state.vpsList =
          action.payload.data?.map((it: any) => ({
            ...it,
            total: it?.vps_id?.total,
          })) || [];

        state.total = action.payload.total;
        state.totalMoney = action.payload.totalMoney;
        state.isLoading = false;
      })
      .addCase(asyncThunkPaginationVpsVng.rejected, (state) => {
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
  setDueDate,
  setSearch,
  setOs,
  setRangeDate,
} = vpsVngSlice.actions;

export default vpsVngSlice.reducer;
