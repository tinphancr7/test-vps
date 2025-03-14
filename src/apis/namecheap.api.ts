import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class NameCheapApi {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  searchAvailable(domain: string, pageIndex: number = 1) {
    return this.instance.get("/name-cheap/search-available-domain", {
      params: { domain, pageIndex },
    });
  }
}

const nameCheapApi = new NameCheapApi();
export default nameCheapApi;
