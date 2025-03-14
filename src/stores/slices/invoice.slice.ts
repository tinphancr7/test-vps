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
export const fetchInvoice = createAsyncThunk(
	"invoice/fetchInvoice",
	async (params: any) => {
		const response = await invoiceApi.callFetchInvoice(params);

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

export const invoiceSlide = createSlice({
	name: "invoice",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(fetchInvoice.pending, (state, _action) => {
			state.isLoading = true;
		});

		builder.addCase(fetchInvoice.rejected, (state, _action) => {
			state.isLoading = false;
		});

		builder.addCase(fetchInvoice.fulfilled, (state, action) => {
			state.isLoading = false;
			state.meta = action.payload.data.meta;
			state.result = action.payload.data.result;
		});
	},
});

export const {} = invoiceSlide.actions;

export default invoiceSlide.reducer;
