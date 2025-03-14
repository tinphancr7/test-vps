/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */

import logApi from "@/apis/log.api";
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
export const fetchLog = createAsyncThunk(
	"team/fetchLog",
	async ({page, limit, search, startDate, endDate, action, subject}: any) => {
		const response = await logApi.callFetchLog({
			search,
			page,
			limit,
			startDate,
			endDate,
			action,
			subject,
		});

		return response?.data;
	}
);

const initialState: IState = {
	isLoading: true,
	meta: {
		page: 1,
		limit: 10,
		totalPages: 0,
		totalItems: 0,
	},
	result: [],
};

export const teamSlide = createSlice({
	name: "team",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(fetchLog.pending, (state, _action) => {
			state.isLoading = true;
		});

		builder.addCase(fetchLog.rejected, (state, _action) => {
			state.isLoading = false;
		});

		builder.addCase(fetchLog.fulfilled, (state, action) => {
			if (action.payload && action.payload.data) {
				state.isLoading = false;
				state.meta = action.payload.data.meta;
				state.result = action.payload.data.result;
			}
		});
	},
});

export const {} = teamSlide.actions;

export default teamSlide.reducer;
