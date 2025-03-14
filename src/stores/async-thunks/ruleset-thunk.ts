import rulesetApi from "@/apis/ruleset.api";
import {createAsyncThunk} from "@reduxjs/toolkit";

// First, create the thunk
// export const fetchRulesetById = createAsyncThunk(
// 	"ruleset/fetchRulesetById",
// 	async ({search, ruleset_id, zone_id}: any) => {
// 		const response = await rulesetApi.callFetchRulesetById({
// 			search,
// 			zone_id,
// 			ruleset_id,
// 		});

// 		return response?.data;
// 	}
// );

// ** services

export const getAllRulesetsAsync = createAsyncThunk(
	"ruleset/get-all",
	async (data: any) => {
		const response = await rulesetApi.getAllRulesets(data);

		return response;
	}
);
export const getAllRulesAsync = createAsyncThunk(
	"rule/get-all",
	async (data: any) => {
		try {
			const response = await rulesetApi.getAllRules(data);

			return response;
		} catch (error) {
			return {
				data: null,
				message: error?.response?.data?.message,
				typeError: error?.response?.data?.typeError,
			};
		}
	}
);
export const createRuleAsync = createAsyncThunk(
	"rule/create",
	async (data: any) => {
		try {
			const response = await rulesetApi.createRule(data);

			return response;
		} catch (error) {
			return {
				data: null,
				message: error?.response?.data?.message,
				typeError: error?.response?.data?.typeError,
			};
		}
	}
);

export const getRulesetAsync = createAsyncThunk(
	"ruleset/get",
	async (data: any) => {
		try {
			const response = await rulesetApi.getRuleset(data);

			return response;
		} catch (error) {
			return {
				data: null,
				message: error?.response?.data?.message,
				typeError: error?.response?.data?.typeError,
			};
		}
	}
);

export const createRulesetAsync = createAsyncThunk(
	"ruleset/create",
	async (data: any) => {
		const response = await rulesetApi.createRuleset(data);

		if (response?.data) {
			return response;
		}

		return {
			data: null,
			message: response?.response?.data?.message,
			typeError: response?.response?.data?.typeError,
		};
	}
);

export const updateRulesetAsync = createAsyncThunk(
	"rule/update",
	async (data: any) => {
		const response = await rulesetApi.updateRuleset(data);

		return response;
	}
);

export const deleteRuleAsync = createAsyncThunk(
	"rule/delete",
	async (data: any) => {
		const response = await rulesetApi.deleteRule(data);

		return response;
	}
);
