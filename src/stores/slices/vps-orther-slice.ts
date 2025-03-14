import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkPaginationVpsOrther } from "../async-thunks/vps-orther-thunk";
import { VpsOrtherState } from "@/interfaces/vps-orther-state";

const initialState: VpsOrtherState = {
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
  search: {},
  provider: "",
  dateRange: {
    endDate: undefined,
    startDate: undefined,
  },
};

const vpsOrtherSlice = createSlice({
  name: "vpsOrther",
  initialState,
  reducers: {
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
    setOs: (state, action) => {
      state.os = action.payload;
    },
    setDueDate: (state, action) => {
      state.dueDate = action.payload;
    },
    resetFilter: (state) => {
      state.status = "";
      state.teamSelected = null;
      state.searchByIp = "";
      state.productName = "";
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncThunkPaginationVpsOrther.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkPaginationVpsOrther.fulfilled, (state, action) => {
        state.vpsList = action.payload.data?.map((it: any) => ({
          ...it,
          total: it?.vps_id?.total,
        }));
        state.total = action.payload.total;
        state.totalMoney = action.payload.totalMoney;
        state.isLoading = false;
      })
      .addCase(asyncThunkPaginationVpsOrther.rejected, (state) => {
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
  setProvider,
} = vpsOrtherSlice.actions;

export default vpsOrtherSlice.reducer;
