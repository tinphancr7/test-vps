/**
 * 
Module CloudflareApiKey
 */

import HttpService from "@/configs/http";
import { filterParams } from "@/utils";
import { AxiosInstance } from "axios";

class CloudflareApiKeyServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  callCreateCloudflareApiKey = (body: any) => {
    return this.instance.post("cloudflare-api-key", body);
  };

  callUpdateCloudflareApiKey = (body: any, id: string) => {
    return this.instance.put(`cloudflare-api-key/${id}`, body);
  };

  callDeleteCloudflareApiKey = (ids: string) => {
    return this.instance.delete(`cloudflare-api-key/${ids}`);
  };

  callFetchCloudflareApiKey = (params: any) => {
    return this.instance.get("cloudflare-api-key/get-paging", {
      params: filterParams(params),
    });
  };

  callFetchCloudflareApiKeyById = (id: string) => {
    return this.instance.get(`cloudflare-api-key/${id}`);
  };
}

const cloudflareApiKeyApi = new CloudflareApiKeyServices();
export default cloudflareApiKeyApi;
