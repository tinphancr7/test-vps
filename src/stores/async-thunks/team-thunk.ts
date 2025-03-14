import teamApi from "@/apis/team.api";
import {createAsyncThunk} from "@reduxjs/toolkit";

// First, create the thunk
export const fetchTeam = createAsyncThunk(
	"team/fetchTeam",
	async ({search, page, limit}: any) => {
		const response = await teamApi.callFetchTeam({
			search,
			page,
			limit,
		});

		return response?.data;
	}
);

export const asyncThunkGetAllYourTeam = createAsyncThunk(
	"team/get-all-your-team",
	async () => {
		const {data} = await teamApi.getAllYourTeam();

		return data?.data as Array<any>;
	}
);
