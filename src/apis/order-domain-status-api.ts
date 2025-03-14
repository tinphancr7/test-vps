import HttpService from "@/configs/http";
import { Pagination } from "@/interfaces/pagination";
import { AxiosInstance } from "axios";

type PayloadCreateOrderDomainStatus = {
    name: string;
    code: string;
};

export interface GetPagingOrderDomainStatus extends Pagination {
    search?: string;
}

class OrderDomainStatusServices {
    private instance: AxiosInstance;

    constructor() {
        this.instance = HttpService.getInstance(); // Use the shared Axios instance
    }

    create(payload: PayloadCreateOrderDomainStatus) {
        return this.instance.post("/order-domain-statuses", payload);
    }

    update(id: string, payload: any) {
        return this.instance.put(`/order-domain-statuses/${id}`, payload)
    }

    delete(id: string) {
        return this.instance.delete(`/order-domain-statuses/${id}`)
    }

    getPagination(query: GetPagingOrderDomainStatus) {
        return this.instance.get("/order-domain-statuses", {
            params: query,
        });
    }

    getById(id: string) {
        return this.instance.get(`/order-domain-statuses/${id}`)
    }
}

const ordersDomainStatusApis = new OrderDomainStatusServices();
export default ordersDomainStatusApis;
