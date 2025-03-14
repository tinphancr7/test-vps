import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class ProviderServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  getListProviderOnOwn() {
    return this.instance.get("/providers/get-list-provider-on-own");
  }
}

const ProviderApis = new ProviderServices();
export default ProviderApis;
