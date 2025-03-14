import { createSlice } from "@reduxjs/toolkit";
import { AwsLightsailState } from "@/interfaces/aws-lightsail-state";
import {
  asyncThunkGetInstanceAwsLightsailByVpsId,
  asyncThunkPaginationAwsLightsail,
} from "../async-thunks/aws-lightsail-thunk";

const initialState: AwsLightsailState = {
  instancesList: [],
  instance: {},
  total: 0,
  totalPrice: 0,
  isLoading: false,
  isSubmitting: false,
  status: "",
  teamSelected: null,
  searchByIp: "",
};

const awsLightsailSlice = createSlice({
  name: "awsLightsail",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    setTeamSelected: (state, action) => {
      state.teamSelected = action.payload;
    },

    setSearchByIp: (state, action) => {
      state.searchByIp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncThunkPaginationAwsLightsail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkPaginationAwsLightsail.fulfilled, (state, action) => {
        state.instancesList = action.payload.data;
        state.total = action.payload.total;
        state.totalPrice = action.payload.totalPrice;
        state.isLoading = false;
      })
      .addCase(asyncThunkPaginationAwsLightsail.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(asyncThunkGetInstanceAwsLightsailByVpsId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        asyncThunkGetInstanceAwsLightsailByVpsId.fulfilled,
        (state, action) => {
          state.instance = action.payload.data;
          state.isLoading = false;
        }
      )
      .addCase(asyncThunkGetInstanceAwsLightsailByVpsId.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setStatus, setTeamSelected, setSearchByIp } =
  awsLightsailSlice.actions;

export default awsLightsailSlice.reducer;
