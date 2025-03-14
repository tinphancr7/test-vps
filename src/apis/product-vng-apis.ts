import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class ProdVngServices {
    private instance: AxiosInstance;

    constructor() {
        this.instance = HttpService.getInstance(); // Use the shared Axios instance
    }

	getAllProducts() {
		return this.instance.get("/product-vngs/get-products");
	}

    getProductById(id: string) {
		return this.instance.get(`/product-vngs/${id}`);
    }
}

const prodVngApis = new ProdVngServices();
export default prodVngApis;
