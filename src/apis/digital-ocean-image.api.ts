import HttpService from "@/configs/http";
import {AxiosInstance} from "axios";

class DigitalOceanImageApiService {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}
	getAllListImage = () => {
		return this.instance.get("/digital-ocean/images/get-all");
	};
}

const digitalOceanImageApi = new DigitalOceanImageApiService();
export default digitalOceanImageApi;
