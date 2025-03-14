import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class WhoIsDomainServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  callFetchDNSDomain = (query: string) => {
    return this.instance.get(
      `/manager-supplies-domain/getDNSDomain?domain=${query}`
    );
  };
  callFetchWhoIsDomain = (query: string) => {
    return this.instance.get(
      `/manager-supplies-domain/getWhoIsDomain?domain=${query}`
    );
  };
}

const whoIsDomainApi = new WhoIsDomainServices();
export default whoIsDomainApi;
