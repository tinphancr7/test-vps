/**
 * 
Module log
 */

import HttpService from "@/configs/http";
import {filterParams} from "@/utils";
import {AxiosInstance} from "axios";

class LogServices {
	private instance: AxiosInstance;
	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}
	callCreateLog = (body: any) => {
		return this.instance.post("logs", {
			...body,
		});
	};

	callUpdateLog = (body: any, id: string) => {
		return this.instance.put(`/logs/update/${id}`, {
			...body,
		});
	};

	callDeleteLog = (ids: string) => {
		return this.instance.delete(`/logs/delete/${ids}`);
	};

	callFetchLog = ({
		search,
		page,
		limit,
		startDate,
		endDate,
		action,
		subject,
	}: any) => {
		return this.instance.get("/logs/get-paging", {
			params: filterParams({
				search,
				page,
				limit,
				startDate,
				endDate,
				action,
				subject,
			}),
		});
	};

	callFetchLogById = (id: string) => {
		return this.instance.get(`/logs/${id}`);
	};
}

const logApi = new LogServices();
export default logApi;
