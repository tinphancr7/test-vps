import axios, {AxiosInstance} from "axios";
import {API_SERVICE} from "./apis-multi-cloud";

export class HttpServiceMuiltiCloud {
	instance: AxiosInstance;
	private static instance: any; // Static instance

	constructor() {
		this.instance = axios.create({
			baseURL: `${API_SERVICE}`,
			timeout: 50000,
			headers: {"Content-Type": "application/json"},
			withCredentials: true,
		});
	}
	// Singleton getInstance method
	public static getInstance() {
		if (!HttpServiceMuiltiCloud.instance) {
			HttpServiceMuiltiCloud.instance = new HttpServiceMuiltiCloud().instance;
		}
		return HttpServiceMuiltiCloud.instance;
	}
}
