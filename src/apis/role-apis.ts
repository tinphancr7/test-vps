import HttpService from "@/configs/http";
import {AxiosInstance} from "axios";

class RoleServices {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}

	async getAllRoles() {
		return this.instance.get("/roles/get-all");
	}
	async getRoleById(id: string) {
		return this.instance.get(`/roles/${id}`);
	}

	async deleteRole(id: string) {
		return this.instance.delete(`/roles/${id}`);
	}
}

const roleApis = new RoleServices();
export default roleApis;
