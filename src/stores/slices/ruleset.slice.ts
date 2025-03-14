// ** Redux Imports

import {createSlice} from "@reduxjs/toolkit";
import {
	createRuleAsync,
	createRulesetAsync,
	deleteRuleAsync,
	deleteRulesetAsync,
	getAllRulesAsync,
	getAllRulesetsAsync,
	getRulesetAsync,
	updateRulesetAsync,
} from "../async-thunks/ruleset-thunk";

// ** Axios Imports

const initialState = {
	isLoading: false,
	isSuccess: true,
	isError: false,
	message: "",
	typeError: "",
	isSuccessCreateEdit: false,
	isErrorCreateEdit: false,
	messageErrorCreateEdit: "",
	isSuccessDelete: false,
	isErrorDelete: false,
	messageErrorDelete: "",
	isSuccessMultipleDelete: false,
	isErrorMultipleDelete: false,
	messageErrorMultipleDelete: "",
	result: [],
	result_info: {
		total_count: 0,
		total_pages: 0,
	},
};

export const rulesetSlice = createSlice({
	name: "ruleset",
	initialState,
	reducers: {
		resetInitialState: (state) => {
			state.isLoading = false;
			state.isSuccess = false;
			state.isError = true;
			state.message = "";
			state.typeError = "";
			state.isSuccessCreateEdit = false;
			state.isErrorCreateEdit = true;
			state.messageErrorCreateEdit = "";
			state.isSuccessDelete = false;
			state.isErrorDelete = true;
			state.messageErrorDelete = "";
			state.isSuccessMultipleDelete = false;
			state.isErrorMultipleDelete = true;
			state.messageErrorMultipleDelete = "";
		},
	},
	extraReducers: (builder) => {
		// Get all Rulesets
		builder.addCase(getAllRulesAsync.pending, (state) => {
			state.isLoading = true;
		});

		builder.addCase(getAllRulesAsync.fulfilled, (state, action) => {
			state.isLoading = false;
			state.result = action.payload.rules;
		});

		builder.addCase(getAllRulesAsync.rejected, (state) => {
			state.isLoading = false;
			state.result = [];
			state.result_info = {};
		});

		// Create role
		builder.addCase(createRuleAsync.pending, (state) => {
			state.isLoading = true;
		});

		builder.addCase(createRuleAsync.fulfilled, (state, action) => {
			console.log("Action", action.payload);
			state.isLoading = false;
			state.isSuccessCreateEdit = !!action.payload?.id;
			state.isErrorCreateEdit = !action.payload?.id;
			state.messageErrorCreateEdit = action.payload?.message;
			state.typeError = action.payload?.typeError;
		});

		// Update role
		builder.addCase(updateRulesetAsync.pending, (state) => {
			state.isLoading = true;
		});

		builder.addCase(updateRulesetAsync.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccessCreateEdit = !!action.payload?.id;
			state.isErrorCreateEdit = !action.payload?.id;
			state.messageErrorCreateEdit = action.payload?.message;
			state.typeError = action.payload?.typeError;
		});

		// Delete role
		builder.addCase(deleteRuleAsync.pending, (state) => {
			state.isLoading = true;
		});

		builder.addCase(deleteRuleAsync.fulfilled, (state, action) => {
			console.log("addDeleteRuleAsync", action.payload);
			state.isLoading = false;
			state.isSuccessDelete = !!action.payload?.id;
			state.isErrorDelete = !action.payload?.id;
			state.messageErrorDelete = action.payload?.message;
			state.typeError = action.payload?.typeError;
		});
	},
});

export const {resetInitialState} = rulesetSlice.actions;
export default rulesetSlice.reducer;
