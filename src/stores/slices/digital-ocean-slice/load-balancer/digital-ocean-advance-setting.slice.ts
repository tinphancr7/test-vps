import { createSlice } from "@reduxjs/toolkit";

interface DigitalOceanAdvanceSetting {
  stickySessions: string;
  protocol: string;
  healcheckProtocol: string;
  healcheckPort: number;
  healcheckPath: string;
  healcheck_check_interval_seconds: number;
  healcheck_response_timeout_seconds: number;
  healcheck_healthy_threshold: number;
  healcheck_unhealthy_threshold: number;

  redirect_http_to_https: boolean;
  enable_proxy_protocol: boolean;
  enable_backend_keepalive: boolean;
  http_idle_timeout_seconds: number; // [30...600]
  cookieName: string;
  ttl: number;
  statusAdvanceSetting: boolean;
}
const initialState: DigitalOceanAdvanceSetting = {
  stickySessions: "none",
  protocol: "http",
  healcheckProtocol: "",
  healcheckPort: 80,
  healcheckPath: "/",
  healcheck_check_interval_seconds: 10,
  healcheck_response_timeout_seconds: 5,
  healcheck_healthy_threshold: 5,
  healcheck_unhealthy_threshold: 3,
  ttl: 300,
  redirect_http_to_https: false,
  enable_proxy_protocol: false,
  enable_backend_keepalive: true,
  http_idle_timeout_seconds: 60, // [30...600]
  cookieName: "",
  statusAdvanceSetting: false,
};

const digitalOceanAdvanceSetting = createSlice({
  name: "digitalOcean_LB_AdvanceSetting",
  initialState,
  reducers: {
    setDataLBAdvanceSettingDigitalOcean: (state: any, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (action.payload[key] !== undefined) {
          state[key] = action.payload[key];
        }
      });
    },
  },
});

export const { setDataLBAdvanceSettingDigitalOcean } =
  digitalOceanAdvanceSetting.actions;

export default digitalOceanAdvanceSetting.reducer;
