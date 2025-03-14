/**
 * 
Module cloud flare ssl
 */

import HttpService from "@/configs/http";

import { AxiosInstance } from "axios";

class CloudFlrareSslServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  getInforSsl = (zone_id: any) => {
    return this.instance.get(`/cloudflare-ssl/ssl/${zone_id}`);
  };
  getInforSslAutomaticMode = (zone_id: any) => {
    return this.instance.get(`/cloudflare-ssl/ssl_automatic_mode/${zone_id}`);
  };
  getZone = (zone_id: any) => {
    return this.instance.get(`/cloudflare-ssl/zone/${zone_id}`);
  };
  getTLSVersions = (params: {
    zoneTag: string;
    datetimeStart: string;
    datetimeEnd: string;
    limit: number;
  }) => {
    return this.instance.get(`/cloudflare-ssl/versions`, {
      params,
    });
  };
  getZoneAnalytic = (params: {
    zoneTag: string;
    datetimeStart: string;
    datetimeEnd: string;
  }) => {
    return this.instance.get(`/cloudflare-ssl/analytics`, {
      params,
    });
  };
  updateInforSsl = (
    zone_id: string,
    value: "off" | "flexible" | "full" | "strict"
  ) => {
    return this.instance.patch(`/cloudflare-ssl/ssl`, {
      zone_id,
      value,
    });
  };

  updateSslAutomaticMode = (zone_id: string, value: "custom" | "auto") => {
    return this.instance.patch(`/cloudflare-ssl/ssl_automatic_mode`, {
      zone_id,
      value,
    });
  };
}

const cloudflareSslApi = new CloudFlrareSslServices();
export default cloudflareSslApi;
