import HttpService from "@/configs/http";
import { Pagination } from "@/interfaces/pagination";
import {AxiosInstance} from "axios";

export interface IPagination extends Pagination {
    search?: string;
}

class BrandServices {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance();
	}

    create(name: string) {
		return this.instance.post("/brands", { name });
	}

	update(id: string, name: string) {
		return this.instance.put(`/brands/${id}`, { name });
	}

	getById(id: string) {
		return this.instance.get(`/brands/${id}`);
	}

    getPaging(query: IPagination) {
		return this.instance.get("/brands", { 
            params: query 
        });
    }

	getAll() {
		return this.instance.get("/brands/all");
	}

	delete(id: string) {
		return this.instance.delete(`/brands/${id}`);
	}
}

const brandApis = new BrandServices();
export default brandApis;
