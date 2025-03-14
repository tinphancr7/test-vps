import HttpService from "@/configs/http";
import {AxiosInstance} from "axios";

class DigitalOceanSizeApiService {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}
	getAllListSize = () => {
		return this.instance.get("/digital-ocean/sizes/get-all");
	};
}

const digitalOceanSizeApi = new DigitalOceanSizeApiService();
export default digitalOceanSizeApi;
