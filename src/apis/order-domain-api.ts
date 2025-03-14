import HttpService from "@/configs/http";
import { Pagination } from "@/interfaces/pagination";
import { AxiosInstance } from "axios";

type PayloadCreateOrderDomain = {
  team: string;
  brand: string;
  name: string;
};

export interface GetPagingOrdersDomain extends Pagination {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  brand?: string;
  team?: string;
}

class OrdersDomainServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  create(payload: PayloadCreateOrderDomain) {
    return this.instance.post("/orders-domain", payload);
  }

  getPagination(query: GetPagingOrdersDomain) {
    return this.instance.get("/orders-domain", {
      params: query,
    });
  }

  getById(id: string) {
    return this.instance.get(`/orders-domain/${id}`);
  }

  approve(id: string) {
    return this.instance.put(`/orders-domain/approve/${id}`);
  }

  cancel(id: string) {
    return this.instance.put(`/orders-domain/cancel/${id}`);
  }

  buyDomain(id: string) {
    return this.instance.post(`/orders-domain/buy`, { id });
  }

  update(id: string, payload: { cartInfo: any }) {
    return this.instance.put(`/orders-domain/${id}`, payload);
  }
}
// how to recover my account because it contains important data and repositories of my work
const ordersDomainApis = new OrdersDomainServices();
export default ordersDomainApis;
