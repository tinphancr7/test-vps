import HttpService from "@/configs/http";
import { Pagination } from "@/interfaces/pagination";
import { AxiosInstance } from "axios";

export interface GetPagingDns extends Pagination {
  zone_id: string;
  search?: string;
}

type PayloadCreateWebsite = {
  team: string;
  name: string;
  accountId: string;
};

class CloudflareService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  createCloudflareWebSite(payload: PayloadCreateWebsite) {
    return this.instance.post(`cloudflare-websites`, payload);
  }

  getListAccountsCloudflare(query: {
    pageIndex: number;
    pageSize?: number;
    name?: string;
  }) {
    return this.instance.get(`cloudflare-accounts`, {
      params: query,
    });
  }

  getCloudflareWebSite(query: {
    pageIndex: number;
    pageSize: number;
    accountId: string;
    name?: string;
    order?: string;
    search?: string;
  }) {
    return this.instance.get(`cloudflare-websites`, {
      params: query,
    });
  }

  getPagingCloudflareWebSite(query: {
    pageIndex: number;
    pageSize: number;

    name?: string;
    order?: string;
    search?: string;
  }) {
    return this.instance.get(`cloudflare-websites/paging`, {
      params: query,
    });
  }

  deleteWebsite(id: string) {
    return this.instance.delete(`cloudflare-websites/${id}`);
  }

  getZoneAnalytics(query: {
    zone_id: string;
    since: string;
    until: string;
    type: 'date' | 'datetime';
  }) {
    return this.instance.get(`cloudflare-websites/analytics`, {
      params: query
    });
  }

  getDnsBySearchIp(query: any) {
    return this.instance.get(`dns_records/search-by-ip-type-a`, {
      params: query,
    });
  }
  updateMassDnsRecord(data: any) {
    return this.instance.post(`dns_records/update-mass-ip-type-a`, data);
  }

  getDnsList(query: GetPagingDns) {
    return this.instance.get(`dns_records`, {
      params: query,
    });
  }

  createDns(data: any) {
    return this.instance.post(`dns_records`, data);
  }

  deleteDns(id: string, zone_id: string) {
    return this.instance.delete(`dns_records/${id}`, {
      params: { zone_id },
    });
  }

  getDetailDnsById(id: string, zone_id: string) {
    return this.instance.get(`dns_records/${id}`, {
      params: { zone_id },
    });
  }

  updateDns(id: string, data: unknown) {
    return this.instance.put(`dns_records/${id}`, data);
  }

  createPageRule(data: unknown) {
    return this.instance.post(`cloudflare-page-rules`, data);
  }

  getPageRoles(zone_id: string) {
    return this.instance.get(`cloudflare-page-rules`, {
      params: { zone_id },
    });
  }

  getPageRoleDetail(query: { id: string; zone_id: string }) {
    return this.instance.get(`cloudflare-page-rules/detail`, {
      params: query,
    });
  }
  getListAccountFollowTeamId(teamId: string) {
    return this.instance.get(
      `cloudflare-accounts/get-list-follow-team/${teamId}`
    );
  }
  updatePageRole(id: string, data: any) {
    return this.instance.put(`cloudflare-page-rules/${id}`, data);
  }

  deletePageRole(query: { id: string; zone_id: string }) {
    return this.instance.delete(`cloudflare-page-rules`, {
      params: query,
    });
  }
}

const cloudflareApis = new CloudflareService();
export default cloudflareApis;
