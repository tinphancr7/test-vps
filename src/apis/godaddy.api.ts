import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class GodaddyApi {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  searchAvailable(domain: string, pageIndex: number = 1) {
    return this.instance.get("/godaddy/search", {
      params: { domain, pageIndex },
    });
  }
}

const godaddyApi = new GodaddyApi();
export default godaddyApi;
