/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */

import invoiceApi from "@/apis/invoice.api";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

interface IState {
	isLoading: boolean;
	meta: {
		page: number;
		limit: number;
		totalPages: number;
		totalItems: number;
	};
	result: any[];
}
// First, create the thunk
export const fetchStatistic = createAsyncThunk(
	"invoice/fetchStatistic",
	async (params: any) => {
		const response = await invoiceApi.callFetchStatistic(params);

		return response?.data;
	}
);

const initialState: IState = {
	isLoading: false,
	meta: {
		page: 1,
		limit: 10,
		totalPages: 0,
		totalItems: 0,
	},
	result: [],
};

export const statisticSlide = createSlice({
	name: "statistic",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(fetchStatistic.pending, (state, _action) => {
			state.isLoading = true;
		});

		builder.addCase(fetchStatistic.rejected, (state, _action) => {
			state.isLoading = false;
		});

		builder.addCase(fetchStatistic.fulfilled, (state, action) => {
			state.isLoading = false;
			state.meta = action.payload.data.meta;
			state.result = action.payload.data.result;
		});
	},
});

export const {} = statisticSlide.actions;

export default statisticSlide.reducer;
