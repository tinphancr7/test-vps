/**
 * 
Module Site
 */

import HttpService from "@/configs/http";
import { filterParams } from "@/utils";
import { AxiosInstance } from "axios";

class SiteServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  callFetchSite = ({ search, pageIndex, pageSize, provider }: any) => {
    return this.instance.get("/site", {
      params: filterParams({ search, pageIndex, pageSize, provider }),
    });
  };
  callFetchListSiteFollowVpsId = ({ vps_id }: any) => {
    return this.instance.get(`/site/list-site/${vps_id}`);
  };
}

const siteApi = new SiteServices();
export default siteApi;
