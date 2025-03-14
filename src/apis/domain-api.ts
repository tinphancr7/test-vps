import HttpService from "@/configs/http";
import { Pagination } from "@/interfaces/pagination";
import {AxiosInstance} from "axios";

export interface GetPagingDomains extends Pagination {
  status?: string;
  search?: string;
  brand?: string;
  team?: string;
  createdBy?: string;
  manager?: string[];
}

class DomainServices {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}

  getPaging(query: GetPagingDomains) {
    return this.instance.get('/domains', {
      params: query,
    })
  }

  getById(id: string) {
    return this.instance.get(`/domains/${id}`)
  }

  update(id: string, payload: unknown) {
    return this.instance.put(`/domains/${id}`, payload)
  }

  delete(id: string) {
    return this.instance.delete(`/domains/${id}`)
  }
}

const domainApis = new DomainServices();
export default domainApis;
