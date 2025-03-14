/**
 * 
Module Ruleset
 */

import HttpService from "@/configs/http";

import {AxiosInstance} from "axios";

class RulesetServices {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}

	getAllRulesets = async (data: {params: any}) => {
		const res = await this.instance.get(`rulesets`, data);

		return res.data;
	};

	createRuleset = async (data: any) => {
		try {
			const res = await this.instance.post(`rulesets`, data);

			return res.data;
		} catch (error) {
			return error;
		}
	};

	updateRuleset = async (data: any) => {
		const {id, ...rests} = data;

		try {
			const res = await this.instance.put(`rulesets/${id}`, rests);

			return res.data;
		} catch (error) {
			return error;
		}
	};

	deleteRuleset = async (id: string) => {
		try {
			const res = await this.instance.delete(`rulesets/${id}`);

			return res.data;
		} catch (error) {
			return error;
		}
	};

	getAllRules = async (data) => {
		const {id, ...rests} = data;
		const res = await this.instance.get(`rulesets/${id}`, rests);

		return res.data;
	};

	createRule = async (data: any) => {
		try {
			const res = await this.instance.post(`rulesets/rules`, data);

			return res.data;
		} catch (error) {
			return error;
		}
	};
	updateRule = async (data: any) => {
		const {id, ...rests} = data;

		try {
			const res = await this.instance.put(`rulesets/rules/${id}`, rests);

			return res.data;
		} catch (error) {
			return error;
		}
	};

	getRuleset = async (data) => {
		const {id, ...rests} = data;
		const res = await this.instance.get(`rulesets/${id}`, rests);

		return res.data;
	};

	deleteRule = async (data) => {
		const {id, ...rests} = data;
		try {
			const res = await this.instance.delete(`rulesets/rules/${id}`, {
				data: rests,
			});

			return res.data;
		} catch (error) {
			return error;
		}
	};
}

const rulesetApi = new RulesetServices();
export default rulesetApi;
