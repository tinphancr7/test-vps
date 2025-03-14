import HttpService from "@/configs/http";
import {AxiosInstance} from "axios";

interface PermissionRole {
	role: string;
	permission?: {
		[key: string]: boolean;
	};
}

class PermissionServices {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}
	async getPermissionByRoleId(id: string) {
		return this.instance.get(`/permissions/get-all-by-role-id/${id}`);
	}

	async createNewRole(data: PermissionRole) {
		return this.instance.post("/permissions/create-permission-role", data);
	}

	async updatePermissionRole(id: string, data: PermissionRole) {
		return this.instance.put(
			`/permissions/update-permission-by-role-id/${id}`,
			data
		);
	}
}

const permissionApis = new PermissionServices();
export default permissionApis;
