import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkPaginationInvoiceBuCloud } from "../async-thunks/invoice-bu-cloud";

const initialState = {
  invoicesList: [],
  total: 0,
  isLoading: false,
  teamSelected: null,
  time: null,
  search: "",
  query: {},
};

const invoiceBuCloudSlice = createSlice({
  name: "invoiceBuCloud",
  initialState,
  reducers: {
    setTeamSelected: (state, action) => {
      state.teamSelected = action.payload;
    },

    setTime: (state, action) => {
      state.time = action.payload;
    },

    setSearchByIp: (state, action) => {
      state.search = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncThunkPaginationInvoiceBuCloud.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(
        asyncThunkPaginationInvoiceBuCloud.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.invoicesList = action.payload.invoices;
          state.total = action.payload.total;
        }
      )

      .addCase(asyncThunkPaginationInvoiceBuCloud.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export const { setQuery } = invoiceBuCloudSlice.actions;
export default invoiceBuCloudSlice.reducer;
