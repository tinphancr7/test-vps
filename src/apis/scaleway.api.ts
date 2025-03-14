/**
 * 
Module team
 */

import HttpService from "@/configs/http";
import { filterParams } from "@/utils";
import { AxiosInstance } from "axios";
class ScaleWayServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  callFetchInstances = async (query: any) => {
    return await this.instance.get(`/scaleway/instances`, {
      params: filterParams(query),
    });
  };

  callUpdateInstance = async (id: string, body: any) => {
    return await this.instance.put(`/scaleway/instances/${id}`, body);
  };

  callFetchInstanceDetail = async (id: string) => {
    return await this.instance.get(`/scaleway/instances/${id}`);
  };

  callFetchInstanceTypes = async ({ zone, ...rest }: any) => {
    return await this.instance.get(`/scaleway/instance-types/${zone}`, {
      params: filterParams(rest),
    });
  };
  callFetchIps = async ({ page, perPage, zone }: any) => {
    return await this.instance.get(`/scaleway/ips/${zone}`, {
      params: filterParams({ page, perPage }),
    });
  };

  callFetchSShKeys = async ({ page, perPage }: any) => {
    return await this.instance.get(`/scaleway/ssh-keys`, {
      params: filterParams({ page, perPage }),
    });
  };

  callCreateSShKey = async (body: any) => {
    return await this.instance.post(`/scaleway/ssh-keys`, body);
  };

  callCreateIp = async ({ zone, body }: { zone: string; body: any }) => {
    return await this.instance.post(`/scaleway/ips/${zone}`, body);
  };

  callDeleteIp({
    ip,
    zone,
    teamId,
  }: {
    ip: string;
    zone: string;
    teamId: string;
  }) {
    return this.instance.delete(`/scaleway/ips/${ip}/${zone}`, {
      params: filterParams({ teamId }),
    });
  }

  callCreateInstance = async ({ zone, body }: { zone: string; body: any }) => {
    return await this.instance.post(`/scaleway/instances/${zone}`, body);
  };

  callPerformAction = async ({
    zone,
    serverId,
    body,
  }: {
    zone: string;
    serverId: string;
    body: any;
  }) => {
    return await this.instance.post(
      `/scaleway/instances/perform-action/${zone}/${serverId}`,
      body
    );
  };

  callUpdateVolume({
    zone,
    volumeId,
    body,
  }: {
    zone: string;
    volumeId: string;
    body: any;
  }) {
    return this.instance.put(`/scaleway/volumes/${volumeId}/${zone}`, body);
  }
}

const scaleWayApi = new ScaleWayServices();
export default scaleWayApi;
