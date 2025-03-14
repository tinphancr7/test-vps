import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

export type PayloadCreateProvider = {
  name: string;
  exchange_rate: number;
  mails: string[];
};

class OtherProviderServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  create(payload: PayloadCreateProvider) {
    return this.instance.post("/other-provider", payload);
  }

  update(id: string, payload: PayloadCreateProvider) {
    return this.instance.put(`/other-provider/${id}`, payload);
  }

  delete(id: string) {
    return this.instance.delete(`/other-provider/${id}`);
  }

  getPagingOtherProviders(params: any) {
    return this.instance.get("/other-provider/get-paging", {
      params,
    });
  }

  getById(id: string) {
    return this.instance.get(`/other-provider/${id}`);
  }
  getAll() {
    return this.instance.get("/other-provider/get-all");
  }
}

const otherProviderApis = new OtherProviderServices();
export default otherProviderApis;
