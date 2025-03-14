/**
 * Module CloudService
 */

import HttpService from "@/configs/http";
import {
  StorageResponse,
  UpCloudPlanResponse,
  UpCloudPriceResponse,
  ZoneResponse,
} from "@/interfaces/upcloud-response.interface";
import { AxiosInstance, AxiosResponse } from "axios";

class CloudService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  async getListPlan(): Promise<AxiosResponse<UpCloudPlanResponse>> {
    return this.instance.get<UpCloudPlanResponse>("/up-cloud/client/plans");
  }

  async getZones(): Promise<AxiosResponse<ZoneResponse>> {
    return this.instance.get<ZoneResponse>("/up-cloud/client/zones");
  }

  async getStorages(): Promise<AxiosResponse<StorageResponse>> {
    return this.instance.get<StorageResponse>("/up-cloud/client/storages");
  }

  async getPrices(): Promise<AxiosResponse<UpCloudPriceResponse>> {
    return this.instance.get<UpCloudPriceResponse>("/up-cloud/client/prices");
  }
  async createServer(serverData: any): Promise<AxiosResponse> {
    return this.instance.post<any>("/up-cloud/create-server", serverData);
  }
  async getPaging(query: any): Promise<AxiosResponse> {
    return this.instance.get("/up-cloud/get-paging", { params: query });
  }
  async startServer(id: string): Promise<AxiosResponse> {
    return this.instance.get(`/up-cloud/start/${id}`);
  }

  async stopServer(id: string): Promise<AxiosResponse> {
    return this.instance.get(`/up-cloud/stop/${id}`);
  }

  async restartServer(id: string): Promise<AxiosResponse> {
    return this.instance.get(`/up-cloud/restart/${id}`);
  }
  async getDetailServer(id: string) {
    return this.instance.get(`/up-cloud/server/${id}`);
  }
}

const cloudApi = new CloudService();
export default cloudApi;
