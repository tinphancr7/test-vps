import HttpService from "@/configs/http";

import { AxiosInstance } from "axios";

class UserServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  getPaginationUsers(query: any) {
    return this.instance.get("/fingerprint", {
      params: query,
    });
  }
}

const userApis = new UserServices();
export default userApis;
