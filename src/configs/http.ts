import { store } from "@/stores";
import { logout } from "@/stores/slices/auth-slice";

import axios, { AxiosInstance } from "axios";
import { API_SERVICE } from "./apis";
import { getAccessTokenFromLS, setAccessTokenToLS, setUserToLS } from "@/utils/auth";

const refreshAccessToken = async () => {
  const response = await axios.get(`${API_SERVICE}/auths/refresh-token`, {
    withCredentials: true,
  });
  const accessToken = response?.data?.accessToken;

  setAccessTokenToLS(accessToken);

  return { accessToken: accessToken };
};
class HttpService {
  instance: AxiosInstance;

  private accessToken: string | null;
  private refreshTokenReq: Promise<any> | null;
  private static instance: any; // Static instance

  constructor() {
    this.instance = axios.create({
      baseURL: `${API_SERVICE}`,
      timeout: 5000000,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    this.accessToken = getAccessTokenFromLS();
    this.refreshTokenReq = null;
    this.initReqInterceptor();
    this.initResInterceptor();
  }

  // Singleton getInstance method
  public static getInstance() {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService().instance;
    }
    return HttpService.instance;
  }

  private initReqInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        this.accessToken = getAccessTokenFromLS();
        if (config.headers && this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  private initResInterceptor() {
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        const data = response.data;
        if (url === "/auths/verify-2fa" || url === "/auths/sign-in") {
          this.accessToken = data?.accessToken;
          setAccessTokenToLS(this.accessToken);
          setUserToLS({
            ...data?.userData,
            permission: data?.permission,
            role: data?.role,
            accessToken: data?.accessToken,
            refreshToken: data?.refreshToken,
          });
        } else if (url === "/logout") {
          this.accessToken = null;
          this.refreshTokenReq = null;
          store.dispatch(logout());
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Check if it's a 401 error due to expired access token
        if (
          error.response.status === 401 &&
          !originalRequest._retry &&
          error.response?.data?.message === "EXPIRED_ACCESS_TOKEN"
        ) {
          originalRequest._retry = true;

          // If a refresh token request is already in progress, wait for it to complete
          if (!this.refreshTokenReq) {
            this.refreshTokenReq = refreshAccessToken();
          }

          try {
            // Await the refresh token request to complete
            const { accessToken } = await this.refreshTokenReq;

            // Clear after refresh
            this.refreshTokenReq = null;

            // Update the failed request with the new access token and retry

            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return this.instance(originalRequest); // Retry the original request
          } catch (refreshError) {
            store.dispatch(logout()); // Handle refresh failure, like logging out
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }
}
export default HttpService;
