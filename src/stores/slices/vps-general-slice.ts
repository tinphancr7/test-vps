import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkPaginationVpsGeneral } from "../async-thunks/vps-general-thunk";
import { VpsGeneralState } from "@/interfaces/vps-general-state";

const initialState: VpsGeneralState = {
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
  provider: "",
  dueDate: "",
  os: "",
  search: {},
  dateRange: {
    startDate: undefined,
    endDate: undefined,
  },
};

const vpsGeneralSlice = createSlice({
  name: "vpsGeneral",
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
    setProvider: (state, action) => {
      state.provider = action.payload;
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

      .addCase(asyncThunkPaginationVpsGeneral.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkPaginationVpsGeneral.fulfilled, (state, action) => {
        state.vpsList =
          action.payload.data?.map((it: any) => ({
            ...it,
            total: it?.vps_id?.total,
          })) || [];

        state.total = action.payload.total;
        state.totalMoney = action.payload.totalMoney;
        state.isLoading = false;
      })
      .addCase(asyncThunkPaginationVpsGeneral.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setStatus,
  setSite,
  setProvider,
  setTeamSelected,
  setSearchByIp,
  setProductName,
  setDueDate,
  setSearch,
  setOs,
  setRangeDate,
} = vpsGeneralSlice.actions;

export default vpsGeneralSlice.reducer;
