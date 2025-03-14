/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {createSlice} from "@reduxjs/toolkit";
import {asyncThunkGetAllYourTeam, fetchTeam} from "../async-thunks/team-thunk";

interface IState {
	isLoading: boolean;
	meta: {
		page: number;
		limit: number;
		totalPages: number;
		totalItems: number;
	};
	result: any[];
	teams: Array<any>;
}

const initialState: IState = {
	isLoading: true,
	meta: {
		page: 1,
		limit: 10,
		totalPages: 0,
		totalItems: 0,
	},
	result: [],
	teams: [],
};

export const teamSlide = createSlice({
	name: "team",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(fetchTeam.pending, (state, _action) => {
			state.isLoading = true;
		});

		builder.addCase(fetchTeam.rejected, (state, _action) => {
			state.isLoading = false;
		});

		builder.addCase(fetchTeam.fulfilled, (state, action) => {
			if (action.payload && action.payload.data) {
				state.isLoading = false;
				state.meta = action.payload.data.meta;
				state.result = action.payload.data.result;
			}
		});

		// getAllYourTeam
		builder.addCase(asyncThunkGetAllYourTeam.pending, (state) => {
			state.isLoading = true;
		});

		builder.addCase(asyncThunkGetAllYourTeam.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(asyncThunkGetAllYourTeam.fulfilled, (state, action) => {
			state.isLoading = false;
			state.teams = action.payload as Array<any>;
		});
	},
});

export const {} = teamSlide.actions;

export default teamSlide.reducer;
