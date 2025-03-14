import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

export interface SignInDto {
  username: string;
  password: string;
}

class AuthServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  signIn(payload: SignInDto) {
    return this.instance.post("/auths/sign-in", payload);
  }

  async callLogout() {
    return await this.instance.post("/auths/logout");
  }

  verify2FA(payload: { token: string; secret: string }) {
    return this.instance.post("/auths/verify-2fa", payload);
  }

  disable2FA(token: string) {
    return this.instance.put("/auths/disable-2fa", { token });
  }
  checkIpWhiteList() {
    return this.instance.get("/auths/check-ip-whitelist");
  }
}

const authApis = new AuthServices();
export default authApis;
