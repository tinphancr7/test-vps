/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */

import accountApi from "@/apis/account.api";
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
export const fetchAccount = createAsyncThunk(
	"account/fetchAccount",
	async (params: any) => {
		const response = await accountApi.callFetchAccount(params);

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

export const accountSlide = createSlice({
	name: "account",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(fetchAccount.pending, (state, _action) => {
			state.isLoading = true;
		});

		builder.addCase(fetchAccount.rejected, (state, _action) => {
			state.isLoading = false;
		});

		builder.addCase(fetchAccount.fulfilled, (state, action) => {
			if (action.payload && action.payload.data) {
				state.isLoading = false;
				state.meta = action.payload.data.meta;
				state.result = action.payload.data.result;
			}
		});
	},
});

export const {} = accountSlide.actions;

export default accountSlide.reducer;
