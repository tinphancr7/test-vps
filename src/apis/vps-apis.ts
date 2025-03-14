import HttpService from "@/configs/http";
import { CYCLE_TIME } from "@/constants/cycle-time";
import { VpsTypeEnum } from "@/constants/enum";
import { Pagination } from "@/interfaces/pagination";
import { AxiosInstance } from "axios";

export interface VpsPayload {
  cycle: CYCLE_TIME;
  os: string;
  vpsType: VpsTypeEnum;
  product_id: string | number;
  quanlity: number;
  teamId: string;
}

export interface PayLoadUpdateLabelVps {
  label: string;
  vpsType: VpsTypeEnum;
}

export interface GetPagingVps extends Pagination {
  status?: string;
  type?: VpsTypeEnum;
  team?: string;
  create_by?: string;
  search?: string;
}

class VpsServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  createNewVps(data: VpsPayload) {
    return this.instance.post("/vps/create-vps", data);
  }

  renewVps(data: any) {
    return this.instance.post("/vps/renew-vps", data);
  }
  // ?
  getInfoListVPSRenew(data: any) {
    return this.instance.post("/vps/info-renew-vps", data);
  }

  autoRenewVPS(data: any) {
    return this.instance.post("/vps/auto-renew-vps", data);
  }

  createInvoice(data: any) {
    return this.instance.post("/vps/create-invoice-vps", data);
  }

  getPagingVpsVietStackOrVng(query: GetPagingVps) {
    return this.instance.get(`/vps/get-paging`, {
      params: query,
    });
  }

  getDetailVmServiceByVpsId(id: string) {
    return this.instance.get(`/vps/detail/${id}`);
  }

  updateNoteVps(id: string, payload: string) {
    return this.instance.put(`/vps/${id}/note`, {
      note: payload,
    });
  }

  updateLabelVps(id: string, payload: PayLoadUpdateLabelVps) {
    return this.instance.put(`/vps/${id}/label`, payload);
  }

  startVps(id: string, service_id: string, server_id: string) {
    return this.instance.put(`/vps/restart/${id}/${service_id}/${server_id}`);
  }
  stopVps(id: string, service_id: string, server_id: string) {
    return this.instance.put(`/vps/stop/${id}/${service_id}/${server_id}`);
  }

  rebootVps(id: string, service_id: string, server_id: string) {
    return this.instance.put(`/vps/reboot/${id}/${service_id}/${server_id}`);
  }

  rebuildVps(
    id: string,
    template_id: string,
    service_id: string,
    server_id: string
  ) {
    return this.instance.put(
      `/vps/rebuild/${id}/:${template_id}/${service_id}/${server_id}`
    );
  }

  shutdownVps(id: string, service_id: string, server_id: string) {
    return this.instance.put(`/vps/shutdown/${id}/${service_id}/${server_id}`);
  }

  callFetchOS(id: string) {
    return this.instance.get(`/vps/get-list-os-by-service/${id}`);
  }
  callAccessPanel = (id: string) => {
    return this.instance.get(`/vps/get-token-aapanel/${id}`);
  };

  updateAccountAapanel = (id: string, body: any) => {
    return this.instance.put(`/vps/update-account-aapnel/${id}`, body);
  };

  getPwVps(id: string) {
    return this.instance.get(`/vps/get-password/${id}`);
  }

  getPwAaPanel(id: string) {
    return this.instance.get(`/vps/get-password-aapanel/${id}`);
  }

  getPagingAwsLightsailInstances(query: GetPagingVps) {
    return this.instance.get(`/vps/aws-instances`, {
      params: query,
    });
  }

  getAwsInstanceByVpsId(id: string) {
    return this.instance.get(`/vps/aws-instances/${id}`);
  }

  getPagingInstancesAlibabaEcs(query: GetPagingVps) {
    return this.instance.get(`/vps/alibaba-ecs-instances`, {
      params: query,
    });
  }

  getAlibabaEcsInstanceByVpsId(id: string) {
    return this.instance.get(`/vps/alibaba-ecs-instances/${id}`);
  }

  getPagingInstancesBuCloudAlibabaEcs(query: GetPagingVps) {
    return this.instance.get(`/vps/bucloud-alibaba-ecs-instances`, {
      params: query,
    });
  }

  getBuCloudAlibabaEcsInstanceByVpsId(id: string) {
    return this.instance.get(`/vps/bucloud-alibaba-ecs-instances/${id}`);
  }

  getAapanel = (id: string) => {
    return this.instance.get(`/vps/get-aapanel/${id}`);
  };
  getListVpsAdmin = (ids: string) => {
    return this.instance.get(`/vps/get-list-vps-admin/${ids}`);
  };
  getListVpsFollowVpsIdAdmin = (ids: string) => {
    return this.instance.get(`/vps/get-list-vps-follow-vps-id-admin/${ids}`);
  };
  updateAssignedVpsToUser(list_vps: string, list_user: string) {
    return this.instance.put("/vps/update-asigned-users", {
      list_vps,
      list_user,
    });
  }
}

const vpsApis = new VpsServices();
export default vpsApis;
