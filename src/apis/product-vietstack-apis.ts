import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class ProdVietstackServices {
    private instance: AxiosInstance;

    constructor() {
        this.instance = HttpService.getInstance(); // Use the shared Axios instance
    }

	getAllProducts() {
		return this.instance.get("/product-vietstacks/get-products");
	}

    getProductById(id: string) {
		return this.instance.get(`/product-vietstacks/${id}`);
    }
}

const prodVietstackApis = new ProdVietstackServices();
export default prodVietstackApis;
