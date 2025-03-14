/**
 * 
Module DomainProvider
 */

import HttpService from "@/configs/http";
import { filterParams } from "@/utils";
import { AxiosInstance } from "axios";

interface PayloadConfirmDeposit {
  client_id: number;
  amount: number;
}

class domainProviderServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  callCreateDomainProvider = (body: any) => {
    return this.instance.post("/domain-providers", body);
  };

  callUpdateDomainProvider = (body: any, id: string) => {
    return this.instance.put(`/domain-providers/${id}`, body);
  };

  callDeleteDomainProvider = (ids: string) => {
    return this.instance.delete(`/domain-providers/${ids}`);
  };

  callFetchAllDomainProvider = (params: any) => {
    return this.instance.get("/domain-providers", {
      params: filterParams(params),
    });
  };

  callFetchDomainProviderById = (id: string) => {
    return this.instance.get(`/domain-providers/${id}`);
  };

  getAllYourDomainProvider = () => {
    return this.instance.get(`/domain-providers/get-all-your-DomainProvider`);
  };

  getAllDomainProviderDigitalOcean = () => {
    return this.instance.get(`/domain-providers/get-all-DomainProvider-digital-ocean-by-owner`);
  };

  confirmDeposit(payload: PayloadConfirmDeposit) {
    return this.instance.post(`/domain-providers/confirm-deposit`, payload);
  }
}

const domainProviderApi = new domainProviderServices();
export default domainProviderApi;
