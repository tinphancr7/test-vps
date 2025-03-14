import HttpService from "@/configs/http";
import {AxiosInstance} from "axios";

class ProdVietServerServices {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}

	getAllProducts() {
		return this.instance.get("/product-vietserver/get-products");
	}

	getProductById(id: string) {
		return this.instance.get(`/product-vietserver/${id}`);
	}
}

const prodVServerApis = new ProdVietServerServices();
export default prodVServerApis;
