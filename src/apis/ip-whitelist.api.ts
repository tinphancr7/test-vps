import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class IpWhitelistServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  addIp(ipAddress: any, description: any) {
    return this.instance.post("/manage-ip-whitelist/add", {
      ipAddress,
      description,
    });
  }

  updateIp(ipAddress: any, description: any, isActive: any) {
    return this.instance.put(`/manage-ip-whitelist/update/${ipAddress}`, {
      description,
      isActive,
    });
  }

  removeIp(ipAddress: any) {
    return this.instance.delete(`/manage-ip-whitelist/remove/${ipAddress}`);
  }
  getPaging(pageIndex: number, pageSize: number, search?: string) {
    return this.instance.get("/manage-ip-whitelist/paging", {
      params: {
        pageIndex,
        pageSize,
        search,
      },
    });
  }
}

const ipWhitelistApis = new IpWhitelistServices();
export default ipWhitelistApis;
